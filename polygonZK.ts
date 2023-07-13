import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const PK = process.env.PK as string;
const ZK_RPC = process.env.ZK_TESTNET_RPC as string;

const { Network, Alchemy, Wallet, Utils } = require("alchemy-sdk");

const settings = {
  apiKey: "LCOI8Unm4vgo7NPP-lreb7mdtlXIdWjq", // Replace with your Alchemy API Key.
  network: Network.POLYGONZKEVM_TESTNET,
};
const alchemy = new Alchemy(settings);

async function getBalance() {
  const balance = await alchemy.core.getBalance(
    "0xD3564d4C3cE55D4cB9694CDAcE90547F7e7c8628",
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
  // Configurar proveedor de red
  const provider = new ethers.providers.JsonRpcProvider(ZK_RPC);

  // Dirección del remitente
  const senderAddress = "0xD3564d4C3cE55D4cB9694CDAcE90547F7e7c8628";

  // Dirección del destinatario
  const recipientAddress = "0x8b5E7E4C2dfa1fFB078b11fb4Ea226cBb9545b2B";

  // Valor a transferir (en wei)
  const value = ethers.utils.parseEther("0.0001");

  // Crear una instancia de la cartera con la clave privada
  const wallet = new ethers.Wallet(PK, provider);

  // Crear la transacción
  const transaction = {
    to: recipientAddress,
    value: value,
    gasLimit: 21000,
  };

  // Firmar la transacción
  const signedTransaction = await wallet.signTransaction(transaction);

  // Enviar la transacción firmada
  const transactionResponse = await provider.sendTransaction(signedTransaction);

  console.log("Transaction hash:", transactionResponse.hash);
}

sendTransaction();
