// sending bitcoin
const axios = require("axios");
const bitcore = require("bitcore-lib");
require("dotenv").config();
const TESTNET = true;

const BTC_TESNET_PK = process.env.BTC_TESNET_PK;

module.exports = sendBitcoin = async (recieverAddress, amountToSend) => {
  try {
    const privateKey = BTC_TESNET_PK;
    const sourceAddress = "mmoGnzGcM3Y2DjYB3TCCax5Q34XyXtUNFb";
    const satoshiToSend = amountToSend * 100000000;
    let fee = 0;
    let inputCount = 0;
    let outputCount = 2;

    const recommendedFee = await axios.get(
      "https://mempool.space/api/v1/fees/recommended"
    );

    const transaction = new bitcore.Transaction();
    let totalAmountAvailable = 0;

    let inputs = [];
    const resp = await axios({
      method: "GET",
      url: `https://blockstream.info/testnet/api/address/${sourceAddress}/utxo`,
    });
    console.log("Resp of utxo", resp.data);
    const utxos = resp.data;

    for (const utxo of utxos) {
      let input = {};
      input.satoshis = utxo.value;
      input.script =
        bitcore.Script.buildPublicKeyHashOut(sourceAddress).toHex();
      input.address = sourceAddress;
      input.txId = utxo.txid;
      input.outputIndex = utxo.vout;
      totalAmountAvailable += utxo.value;
      inputCount += 1;
      inputs.push(input);
    }

    /**
     * In a bitcoin transaction, the inputs contribute 180 bytes each to the transaction,
     * while the output contributes 34 bytes each to the transaction. Then there is an extra 10 bytes you add or subtract
     * from the transaction as well.
     * */

    const transactionSize =
      inputCount * 180 + outputCount * 34 + 10 - inputCount;

    fee = transactionSize * recommendedFee.data.hourFee; // satoshi per byte
    if (TESTNET) {
      fee = transactionSize * 1; // 1 sat/byte is fine for testnet
    }
    if (totalAmountAvailable - satoshiToSend - fee < 0) {
      throw new Error("Balance is too low for this transaction");
    }
    //Set transaction input
    transaction.from(inputs);

    // set the recieving address and the amount to send
    transaction.to(recieverAddress, satoshiToSend);

    // Set change address - Address to receive the left over funds after transfer
    transaction.change(sourceAddress);

    //manually set transaction fees: 20 satoshis per byte
    transaction.fee(Math.round(fee));

    // Sign transaction with your private key
    transaction.sign(privateKey);

    // serialize Transactions
    const serializedTransaction = transaction.serialize();

    // Send transaction
    const result = await axios({
      method: "POST",
      url: `https://blockstream.info/testnet/api/tx`, // Change testnet to mainnet when you are ready to go live
      data: serializedTransaction,
    });
    return result.data;
  } catch (error) {
    return error;
  }
};
