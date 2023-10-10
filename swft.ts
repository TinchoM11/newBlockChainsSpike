// Reserach on SWFT Bridge to use it with EOS EVM
import axios from "axios";
import { ethers } from "ethers";

const SWFT_API_URL = "https://www.swftc.info/api";

async function getTokensSupported() {
  const res = await axios.get(
    `${SWFT_API_URL}/v1/queryCoinList?supportType=advanced`
  );
  const allTokens = res.data.data;
  console.log(allTokens);
  // const findedTokenSymbol = allTokens.find(
  //   (t: any) =>
  //     t.mainNetwork === "ETH"
  // );
  // console.log(findedTokenSymbol.coinCode);
}

getTokensSupported();

// How many tokens of "receiveCoinCode" can I get for 1 "depositCoinCode"
async function exchangeRate(fromToken: string, toToken: string) {
  const params = {
    depositCoinCode: fromToken,
    receiveCoinCode: toToken,
  };
  const res = await axios.post(`${SWFT_API_URL}/v1/getBaseInfo`, params);
  return res.data.data.instantRate;
}

async function createOrder() {
  const depositCoinCode = "EOS(EVM)";
  const receiveCoinCode = "USDC";
  const instantRate = await exchangeRate(depositCoinCode, receiveCoinCode);
  const depositCoinAmt = "35"; // Amount to Bridge
  const receiveCoinAmt = (parseFloat(depositCoinAmt) * instantRate).toString();

  const params = {
    equipmentNo: "0x2Db0A2F760ff15fC4e8e4B2cC5c15d158136BB70", // Can be user Address
    sourceType: "H5", // Can be Android, IOS or H5 if we are using a web browser
    sourceFlag: "Sphereone",
    depositCoinCode,
    receiveCoinCode,
    depositCoinAmt,
    receiveCoinAmt,
    destinationAddr: "0xaa77292e09f019720fd1C53311c65d6501B7D63f",
    refundAddr: "0x2Db0A2F760ff15fC4e8e4B2cC5c15d158136BB70",
  };

  console.log("Params", params);
  const res = await axios.post(`${SWFT_API_URL}/v2/accountExchange`, params);
  if (res.data.resCode === "921") {
    throw new Error(
      "Error getting Quote fromt SWFT. The amount may be below the minimum required:" +
        res.data.resMsg
    );
  }
  console.log(res.data);
}

//createOrder();

async function uploadDepositTxHash({
  orderId,
  depositTxid,
}: {
  orderId: string;
  depositTxid: string;
}) {
  const SWFT_API_URL = "https://www.swftc.info/api";
  const params = {
    orderId,
    depositTxid,
  };
  const res = await axios.post(`${SWFT_API_URL}/v2/modifyTxId`, params);
  console.log(res.data);
}

//uploadDepositTxHash({
//   orderId: "ca53a5ca-ed68-4d56-86bc-af32329d675a",
//   depositTxid:
//     "0xe4d8cd75334572b0ff5b3daf22eae7176e3cffbbab5c4d50c5c6602f4e8285b2",
// });

async function checkStatus() {
  const params = {
    equipmentNo: "0x2Db0A2F760ff15fC4e8e4B2cC5c15d158136BB70", // The user address
    sourceType: "H5", // Can be Android, IOS or H5 if we are using a web browser
    orderId: "d846ce2a-3261-4be8-a1e0-a1928ebb97cb",
  };
  const res = await axios.post(`${SWFT_API_URL}/v2/queryOrderState`, params);

  if (!res.data.data.depositTxid) {
    console.log("Updating Deposit Tx Hash");
    await uploadDepositTxHash({
      orderId: "d846ce2a-3261-4be8-a1e0-a1928ebb97cb",
      depositTxid:
        "0xf7eb38b182c8d1fb6c1f97373d5a3651f6e9010bd97527c53e04da30773213f1",
    });
  }

  console.log(res.data.data);
}

//checkStatus();

async function estimateGas() {
  // Estimate gas with ethers of a transaction
  const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-mainnet.g.alchemy.com/v2/RV7_ZhCsfmH5q15_TiQKaiV8p87wrls3"
  );
  const tx = await provider.estimateGas({
    to: "0x2Db0A2F760ff15fC4e8e4B2cC5c15d158136BB70",
    data: "0x",
    value: ethers.utils.parseEther("0.1"),
  });
  console.log(tx);

  const tx2 = await provider.getTransactionReceipt(
    "0x8e3820a27d58b25c553985439dd1b45e3731701893796d52bfb8b7eb1f0c64ce"
  );
  console.log(tx2);
}

//estimateGas();

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
