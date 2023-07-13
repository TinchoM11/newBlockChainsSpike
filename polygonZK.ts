import { ethers } from "ethers";

const { Network, Alchemy, Wallet, Utils } = require("alchemy-sdk");

const settings = {
  apiKey: "LCOI8Unm4vgo7NPP-lreb7mdtlXIdWjq", // Replace with your Alchemy API Key.
  network: Network.POLYGONZKEVM_TESTNET,
};
const alchemy = new Alchemy(settings);

async function getBalance() {
  const balance = await alchemy.core.getBalance(
    "0xF8B56939fF7246142211Ab7b136EB2Ea061046e5",
    "latest"
  );
  console.log("Balance of Specific Address:");
  console.log(balance.toString());
}

getBalance();

async function getTransactionReceipt() {
  const receipt = await alchemy.core.getTransactionReceipt(
    "0x76ddc733f991d172e77afeca56e79870bc46e4997afe1145a2b44cd7de02208e"
  );
  console.log("--------------------");
  console.log("Get  Transaction Receipt:");
  console.log(receipt);
}

getTransactionReceipt();

async function getTransactionByHash() {
  const tx = await alchemy.core.getTransaction(
    "0x76ddc733f991d172e77afeca56e79870bc46e4997afe1145a2b44cd7de02208e"
  );
  console.log("--------------------");
  console.log("Transaction Information:");
  console.log(tx);
}

getTransactionByHash();

async function sendTransaction() {
  // Creating a new wallet instance
  const wallet = new Wallet(
    "XXXXXXXXXXXXXX" // inster your private key here
  );

  console.log("Wallet Address:", wallet.getAddress());

  // creating the transaction object
  const transaction = {
    to: "0xAE13fCFb77eb02361C196e30105E91867AfaC369",
    value: ethers.utils.parseEther("0.001"),
    gasLimit: "21000",
    maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei"),
    maxFeePerGas: ethers.utils.parseUnits("20", "gwei"),
    nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
    type: 2,
    chainId: 1442,
  };

  // signing the transaction
  const rawTransaction = await wallet.signTransaction(transaction);

  // sending the transaction
  let sentTx = await alchemy.transact.sendTransaction(rawTransaction);
  console.log("Sending Transaction");
  // Logging the sent tx object
  console.log(sentTx);
}

sendTransaction();
