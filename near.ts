// @ts-nocheck
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

import * as nearAPI from "near-api-js";
const { utils, keyStores, KeyPair, connect } = nearAPI;

const QUICKNODE_NEAR_RPC = process.env.NEAR_RPC as string;

async function nearTransfer() {
  // First create a key store to manage our NEAR credentials
  const myKeyStore = new keyStores.InMemoryKeyStore();
  const PRIVATE_KEY =
    "by8kdJoJHu7uUkKfoaLd2J2Dp1q1TigeWMG123pHdu9UREqPcshCM223kWadm"; // Where did this come from?
  // creates a public / private key pair using the provided private key
  // and then adds the keyPair you created to keyStore
  const keyPair = KeyPair.fromString(PRIVATE_KEY);
  await myKeyStore.setKey("testnet", "example-account.testnet", keyPair);

  // Connection to Near
  const connectionConfig = {
    networkId: "testnet",
    keyStore: myKeyStore, // first create a key store
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };
  const nearConnection = await connect(connectionConfig);

  const account = await nearConnection.account("sender-account.testnet");
  const transferTx = await account.sendMoney(
    "receiver-account.testnet", // receiver account
    "1000000000000000000000000" // amount in yoctoNEAR
  );
  console.log("Transaction Results: ", transferTx);
}

async function nearGetBalance() {
  /// VIEW ACCOUNT
  console.log("                                         ");
  console.log("-----------------------------------------");
  console.log("-------- Get Account Balance --.---------");
  console.log("-----------------------------------------");
  console.log("-----------------------------------------");
  const data = {
    method: "query",
    params: {
      request_type: "view_account",
      finality: "final",
      account_id: "prophet.poolv1.near",
    },
    id: 1,
    jsonrpc: "2.0",
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.post(QUICKNODE_NEAR_RPC, data, config);
    const result = response.data;
    console.log("Account Information: ", result);
    console.log(
      "Native Balance NEAR:",
      utils.format.formatNearAmount(result.result.amount)
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function nearGetTxStatus() {
  // GET TRANSACTION STATUS
  console.log("                                         ");
  console.log("-----------------------------------------");
  console.log("-------- Get Transaction Status ---------");
  console.log("-----------------------------------------");
  console.log("-----------------------------------------");
  const data = {
    jsonrpc: "2.0",
    method: "tx",
    params: ["Ce4DPVFyDRdx54iLoSiKA6gqwGnE5V4mTZyVvFDQsvmN", "relay.aurora"],
    id: 1,
  };

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.post(QUICKNODE_NEAR_RPC, data, config);
    const result = response.data;
    console.log("Transaction Status: ", result);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function nearSendTransaction() {
  // SEND TRANSACTION
  console.log("                                         ");
  console.log("-----------------------------------------");
  console.log("----------- Send Transaction ------------");
  console.log("-----------------------------------------");
  console.log("-----------------------------------------");

  const data = {
    method: "broadcast_tx_commit",
    params: [
      "DgAAAHNlbmRlci50ZXN0bmV0AOrmAai64SZOv9e/naX4W15pJx0GAap35wTT1T/DwcbbDwAAAAAAAAAQAAAAcmVjZWl2ZXIudGVzdG5ldNMnL7URB1cxPOu3G8jTqlEwlcasagIbKlAJlF5ywVFLAQAAAAMAAACh7czOG8LTAAAAAAAAAGQcOG03xVSFQFjoagOb4NBBqWhERnnz45LY4+52JgZhm1iQKz7qAdPByrGFDQhQ2Mfga8RlbysuQ8D8LlA6bQE=",
    ],
    id: 1,
    jsonrpc: "2.0",
  };
  try {
    const response = await axios.post(QUICKNODE_NEAR_RPC, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = response.data;
    console.log("Transaction Status: ", result);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function main() {
  await nearGetBalance();
  await nearGetTxStatus();
  // await nearSendTransaction();
  nearTransfer();
}

main();
