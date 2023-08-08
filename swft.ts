// Reserach on SWFT Bridge to use it with EOS EVM
import axios from "axios";
import { ethers } from "ethers";

const SWFT_API_URL = "https://www.swftc.info/api";

async function getTokensSupported() {
  const params = {
    supportType: "advanced",
    mainNetwork: "SOL", //  --- We can also use POLYGON, BSC, EOS, ETH, AVAXC, FTM, ARB, OPTIMISM, SOL
  };
  const res = await axios.post(`${SWFT_API_URL}/v1/queryCoinList`, params);
  console.log(res.data.data);
  const symbol = res.data.data.filter(
    (token: any) => token.contact === "".toLowerCase()
  );
  console.log(symbol);
}

getTokensSupported();

// How many tokens of "receiveCoinCode" can I get for 1 "depositCoinCode"
async function exchangeRate(fromToken: string, toToken: string) {
  const params = {
    depositCoinCode: fromToken,
    receiveCoinCode: toToken,
  };
  const res = await axios.post(`${SWFT_API_URL}/v1/getBaseInfo`, params);
  console.log(res.data.data);

  return res.data.data.instantRate;
}

async function createOrder() {
  const depositCoinCode = "MATIC(MATIC)";
  const receiveCoinCode = "EOS(EVM)";
  const instantRate = await exchangeRate(depositCoinCode, receiveCoinCode);
  const depositCoinAmt = "26"; // Amount to Bridge
  const receiveCoinAmt = (parseFloat(depositCoinAmt) * instantRate).toString();
  console.log("receiveCoinAmt", receiveCoinAmt);

  const params = {
    equipmentNo: "0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688", // Can be user Address
    sourceType: "H5", // Can be Android, IOS or H5 if we are using a web browser
    sourceFlag: "Sphereone",
    depositCoinCode,
    receiveCoinCode,
    depositCoinAmt,
    receiveCoinAmt,
    destinationAddr: "0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688",
    refundAddr: "0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688",
  };
  const res = await axios.post(`${SWFT_API_URL}/v2/accountExchange`, params);
  console.log(res.data);
}

//createOrder();

async function uploadDepositTxHash() {
  const params = {
    orderId: "7193bf28-aee7-42e3-8851-2b992fd4991d",
    depositTxid:
      "0xffd1bf305bb4ac2c6e30f588c820212bfe3d1684ec834110e75a8e1e61936be0",
  };
  const res = await axios.post(`${SWFT_API_URL}/v2/modifyTxId`, params);
  console.log(res.data);
}

//uploadDepositTxHash();

async function checkStatus() {
  const params = {
    equipmentNo: "0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688", // The user address
    sourceType: "H5", // Can be Android, IOS or H5 if we are using a web browser
    orderId: "7193bf28-aee7-42e3-8851-2b992fd4991d",
  };
  const res = await axios.post(`${SWFT_API_URL}/v2/queryOrderState`, params);
  console.log(res.data);
}

//checkStatus();

/*
Flow to perform a Bridge
1. Get the exchange Rate for the pair of tokens (attention with the symbols, they are different in SWFT. Example Matic on Polygon is MATIC(MATIC), USDT on Polygon is USDT(MATIC), etc).
2. Create an order with the amount to bridge (depositCoinAmt) and the amount to receive (receiveCoinAmt) that will be calculated with the exchange rate * depositCoinAmt
3. Make a Transfer on the origin chain to the address provided by SWFT on the response of the order creation (field platformAddr)
4. Upload the tx hash to SWFT via the endpoint modifyTxId
5. Check the status of the order via the endpoint queryOrderState

The bridge is completed when the field tradeState is equal to "completed"



RESPONSE FROM SWFT ON EACH STEP
CREATED ORDER
{
    resCode: '800',
    resMsg: '成功',
    data: {
      orderId: '7193bf28-aee7-42e3-8851-2b992fd4991d',
      depositCoinCode: 'MATIC(MATIC)',
      receiveCoinCode: 'EOS(EVM)',
      depositCoinAmt: '26',
      receiveCoinAmt: '23.876915',
      receiveSwftAmt: '13.18',
      depositCoinState: 'wait_send',
      platformAddr: '0x242Ea2A8C4a3377A738ed8a0d8cC0Fe8B4D6C36E',
      depositCoinFeeRate: '0.003',
      depositCoinFeeAmt: '0.078',
      swftCoinFeeRate: '0.001',
      orderState: 'wait_deposits',
      swftReceiveAddr: '',
      swftCoinState: '',
      refundCoinMinerFee: '',
      refundCoinAmt: '',
      refundSwftAmt: '',
      destinationAddr: '0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688',
      refundAddr: '0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688',
      swftRefundAddr: '',
      choiseFeeType: '3',
      detailState: 'wait_deposit_send',
      changeType: 'advanced',
      developerId: '',
      transactionId: '',
      refundDepositTxid: '',
      depositTxid: '',
      kycUrl: '',
      dealFinishTime: null,
      createTime: '2023-08-04 20:15:25',
      chainFee: '1',
      depositFeeRate: '0.003',
      instantRate: '0.91834290032',
      isDiscount: 'N',
      xrpInfo: null,
      burnRate: '0',
      noGasTxInfo: null
    }
  }

SENT DEPOSIT TX HASH VIA API: 0xffd1bf305bb4ac2c6e30f588c820212bfe3d1684ec834110e75a8e1e61936be0
{ resCode: '800', resMsg: '成功', data: 'SUCCESS' }

Status Checker After Sending Tx
{
    resCode: '800',
    resMsg: '成功',
    data: {
      orderId: '7193bf28-aee7-42e3-8851-2b992fd4991d',
      depositCoinCode: 'MATIC(MATIC)',
      receiveCoinCode: 'EOS(EVM)',
      depositCoinAmt: '26',
      receiveCoinAmt: '23.876915',
      receiveSwftAmt: '13.18',
      depositCoinState: 'wait_send',
      platformAddr: '0x242Ea2A8C4a3377A738ed8a0d8cC0Fe8B4D6C36E',
      depositCoinFeeRate: '0.003',
      depositCoinFeeAmt: '0.078',
      swftCoinFeeRate: '0.001',
      orderState: 'wait_deposits',
      swftReceiveAddr: null,
      swftCoinState: null,
      refundCoinMinerFee: null,
      refundCoinAmt: '',
      refundSwftAmt: null,
      destinationAddr: '0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688',
      refundAddr: '0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688',
      swftRefundAddr: null,
      choiseFeeType: '3',
      detailState: 'wait_deposit_send',
      transactionId: '',
      refundDepositTxid: '',
      depositTxid: null,
      dealReceiveCoinAmt: '24.876915',
      router: null,
      tradeState: 'wait_deposits',
      changeType: 'advanced',
      dealFinishTime: null,
      createTime: '2023-08-04 20:15:26',
      timeoutShowPlatformAddr: 'N',
      chainFee: '1',
      depositHashExplore: 'https://polygonscan.com/tx/null',
      receiveHashExplore: 'null',
      refundHashExplore: 'https://polygonscan.com/tx/',
      instantRate: '0.91834290032',
      isDiscount: 'N',
      kycUrl: null,
      nftUrl: null,
      isNft: '',
      payTokenUrl: null,
      burnRate: '0',
      depositGasFeeAmt: null,
      gasFee: null,
      gasCode: null,
      noGas: false
    }
  }

I sent manually the tx hash to the API

New Response
{
    resCode: '800',
    resMsg: '成功',
    data: {
      orderId: '7193bf28-aee7-42e3-8851-2b992fd4991d',
      depositCoinCode: 'MATIC(MATIC)',
      receiveCoinCode: 'EOS(EVM)',
      depositCoinAmt: '26',
      receiveCoinAmt: '23.876915',
      receiveSwftAmt: '13.18',
      depositCoinState: 'wait_send',
      platformAddr: '0x242Ea2A8C4a3377A738ed8a0d8cC0Fe8B4D6C36E',
      depositCoinFeeRate: '0.003',
      depositCoinFeeAmt: '0.078',
      swftCoinFeeRate: '0.001',
      orderState: 'wait_deposits',
      swftReceiveAddr: null,
      swftCoinState: null,
      refundCoinMinerFee: null,
      refundCoinAmt: '',
      refundSwftAmt: null,
      destinationAddr: '0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688',
      refundAddr: '0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688',
      swftRefundAddr: null,
      choiseFeeType: '3',
      detailState: 'wait_deposit_send',
      transactionId: '',
      refundDepositTxid: '',
      depositTxid: '0xffd1bf305bb4ac2c6e30f588c820212bfe3d1684ec834110e75a8e1e61936be0',
      dealReceiveCoinAmt: '24.876915',
      router: null,
      tradeState: 'wait_deposits',
      changeType: 'advanced',
      dealFinishTime: null,
      createTime: '2023-08-04 20:15:26',
      timeoutShowPlatformAddr: 'N',
      chainFee: '1',
      depositHashExplore: 'https://polygonscan.com/tx/0xffd1bf305bb4ac2c6e30f588c820212bfe3d1684ec834110e75a8e1e61936be0',
      receiveHashExplore: 'null',
      refundHashExplore: 'https://polygonscan.com/tx/',
      instantRate: '0.91834290032',
      isDiscount: 'N',
      kycUrl: null,
      nftUrl: null,
      isNft: '',
      payTokenUrl: null,
      burnRate: '0',
      depositGasFeeAmt: null,
      gasFee: null,
      gasCode: null,
      noGas: false
    }
  }


Status when deposit is confirmed
{
    resCode: '800',
    resMsg: '成功',
    data: {
      orderId: '7193bf28-aee7-42e3-8851-2b992fd4991d',
      depositCoinCode: 'MATIC(MATIC)',
      receiveCoinCode: 'EOS(EVM)',
      depositCoinAmt: '26',
      receiveCoinAmt: '23.876915',
      receiveSwftAmt: '13.18',
      depositCoinState: 'already_confirm',
      platformAddr: '0x242Ea2A8C4a3377A738ed8a0d8cC0Fe8B4D6C36E',
      depositCoinFeeRate: '0.003',
      depositCoinFeeAmt: '0.078',
      swftCoinFeeRate: '0.001',
      orderState: 'wait_exchange',
      swftReceiveAddr: null,
      swftCoinState: null,
      refundCoinMinerFee: null,
      refundCoinAmt: '',
      refundSwftAmt: null,
      destinationAddr: '0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688',
      refundAddr: '0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688',
      swftRefundAddr: null,
      choiseFeeType: '3',
      detailState: 'wait_exchange_push',
      transactionId: '',
      refundDepositTxid: '',
      depositTxid: '0xffd1bf305bb4ac2c6e30f588c820212bfe3d1684ec834110e75a8e1e61936be0',
      dealReceiveCoinAmt: '24.876915',
      router: null,
      tradeState: 'exchange',
      changeType: 'advanced',
      dealFinishTime: null,
      createTime: '2023-08-04 20:15:26',
      timeoutShowPlatformAddr: 'N',
      chainFee: '1',
      depositHashExplore: 'https://polygonscan.com/tx/0xffd1bf305bb4ac2c6e30f588c820212bfe3d1684ec834110e75a8e1e61936be0',
      receiveHashExplore: 'null',
      refundHashExplore: 'https://polygonscan.com/tx/',
      instantRate: '0.91834290032',
      isDiscount: 'N',
      kycUrl: null,
      nftUrl: null,
      isNft: '',
      payTokenUrl: null,
      burnRate: '0',
      depositGasFeeAmt: null,
      gasFee: null,
      gasCode: null,
      noGas: false
    }
  }

Next status
{
    resCode: '800',
    resMsg: '成功',
    data: {
      orderId: '7193bf28-aee7-42e3-8851-2b992fd4991d',
      depositCoinCode: 'MATIC(MATIC)',
      receiveCoinCode: 'EOS(EVM)',
      depositCoinAmt: '26',
      receiveCoinAmt: '22.835356',
      receiveSwftAmt: '13.18',
      depositCoinState: 'already_confirm',
      platformAddr: '0x242Ea2A8C4a3377A738ed8a0d8cC0Fe8B4D6C36E',
      depositCoinFeeRate: '0.003',
      depositCoinFeeAmt: '0.078',
      swftCoinFeeRate: '0.001',
      orderState: 'wait_send',
      swftReceiveAddr: null,
      swftCoinState: null,
      refundCoinMinerFee: null,
      refundCoinAmt: '',
      refundSwftAmt: null,
      destinationAddr: '0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688',
      refundAddr: '0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688',
      swftRefundAddr: null,
      choiseFeeType: '3',
      detailState: 'wait_receive_confirm',
      transactionId: '0x45d01802d079b5c9824217711f7d557cc35f85c6d2cf663b5754168467534993',
      refundDepositTxid: '',
      depositTxid: '0xffd1bf305bb4ac2c6e30f588c820212bfe3d1684ec834110e75a8e1e61936be0',
      dealReceiveCoinAmt: '23.835356',
      router: null,
      tradeState: 'exchange',
      changeType: 'advanced',
      dealFinishTime: '2023-08-04 20:27:13',
      createTime: '2023-08-04 20:15:26',
      timeoutShowPlatformAddr: 'N',
      chainFee: '1',
      depositHashExplore: 'https://polygonscan.com/tx/0xffd1bf305bb4ac2c6e30f588c820212bfe3d1684ec834110e75a8e1e61936be0',
      receiveHashExplore: 'null0x45d01802d079b5c9824217711f7d557cc35f85c6d2cf663b5754168467534993',
      refundHashExplore: 'https://polygonscan.com/tx/',
      instantRate: '0.878283',
      isDiscount: 'N',
      kycUrl: null,
      nftUrl: null,
      isNft: '',
      payTokenUrl: null,
      burnRate: '0',
      depositGasFeeAmt: null,
      gasFee: null,
      gasCode: null,
      noGas: false
    }
  }

Trade State Completed
{
    resCode: '800',
    resMsg: '成功',
    data: {
      orderId: '7193bf28-aee7-42e3-8851-2b992fd4991d',
      depositCoinCode: 'MATIC(MATIC)',
      receiveCoinCode: 'EOS(EVM)',
      depositCoinAmt: '26',
      receiveCoinAmt: '22.835356',
      receiveSwftAmt: '13.18',
      depositCoinState: 'already_confirm',
      platformAddr: '0x242Ea2A8C4a3377A738ed8a0d8cC0Fe8B4D6C36E',
      depositCoinFeeRate: '0.003',
      depositCoinFeeAmt: '0.078',
      swftCoinFeeRate: '0.001',
      orderState: 'wait_send',
      swftReceiveAddr: null,
      swftCoinState: null,
      refundCoinMinerFee: null,
      refundCoinAmt: '',
      refundSwftAmt: null,
      destinationAddr: '0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688',
      refundAddr: '0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688',
      swftRefundAddr: null,
      choiseFeeType: '3',
      detailState: 'receive_complete',
      transactionId: '0x45d01802d079b5c9824217711f7d557cc35f85c6d2cf663b5754168467534993',
      refundDepositTxid: '',
      depositTxid: '0xffd1bf305bb4ac2c6e30f588c820212bfe3d1684ec834110e75a8e1e61936be0',
      dealReceiveCoinAmt: '23.835356',
      router: null,
      tradeState: 'complete',
      changeType: 'advanced',
      dealFinishTime: '2023-08-04 20:27:13',
      createTime: '2023-08-04 20:15:26',
      timeoutShowPlatformAddr: 'N',
      chainFee: '1',
      depositHashExplore: 'https://polygonscan.com/tx/0xffd1bf305bb4ac2c6e30f588c820212bfe3d1684ec834110e75a8e1e61936be0',
      receiveHashExplore: 'null0x45d01802d079b5c9824217711f7d557cc35f85c6d2cf663b5754168467534993',
      refundHashExplore: 'https://polygonscan.com/tx/',
      instantRate: '0.878283',
      isDiscount: 'N',
      kycUrl: null,
      nftUrl: null,
      isNft: '',
      payTokenUrl: null,
      burnRate: '0',
      depositGasFeeAmt: null,
      gasFee: null,
      gasCode: null,
      noGas: false
    }
  }
*/
