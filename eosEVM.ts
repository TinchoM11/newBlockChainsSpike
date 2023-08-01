// SAME WALLET THAT FOR OTHER EVM CHAINS.
// With the Same PK, you can use the same wallet on all EVM chains.
// So we have the same address for EOS EVM and Ethereum.

require("dotenv").config();
import { ethers } from "ethers";
import axios from "axios";
import { getPrice } from "./pricesApi";
import { EosEvmNetwork, EosEvmNetworkTestnet } from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Erc20EOSList } from "./eosEvmTokenList";

const EOS_RPC = process.env.EOS_RPC as string;
const EOS_PK = process.env.EOS_PK as string;

const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint256)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

const provider = new ethers.providers.JsonRpcProvider(EOS_RPC);

async function main() {
  // Creation of a Wallet
  const wallet = ethers.Wallet.createRandom();
  console.log("Address: " + wallet.address);
  console.log("Private Key: " + wallet.privateKey);

  // Recovery of a Wallet
  const recoveredWallet = new ethers.Wallet(EOS_PK, provider);
  console.log("Address Recovered: " + recoveredWallet.address);

  // Get Native Balance
  console.log("---------- Get Native Balance ----------");
  const balance = await provider.getBalance(recoveredWallet.address);
  console.log("Balances of Wallet", recoveredWallet.address);
  console.log("Balance in Hex:", balance);
  console.log("Balance: " + ethers.utils.formatEther(balance));
  const eosPrice = Number(await getPrice("EOS"));
  const nativeBalanceInUsd =
    parseFloat(ethers.utils.formatEther(balance)) * eosPrice;
  console.log("Balance in USDC:", nativeBalanceInUsd);
  // Get Balance of a Token
  console.log("---------- Get Balance of a Token ----------");
  const contractAddress = "0x9fc25190bac66d7be4639268220d1bd363ca2698";

  const contract = new ethers.Contract(contractAddress, abi, provider);
  const decimals = await contract.decimals();
  console.log("Decimals of Token: " + decimals);
  const symbol = await contract.symbol();
  console.log("Symbol of Token:", symbol);

  const balanceToken = await contract.balanceOf(
    "0xD3564d4C3cE55D4cB9694CDAcE90547F7e7c8628"
  );
  console.log(
    `Balance of ${symbol}: ${ethers.utils.formatUnits(balanceToken, decimals)}`
  );

  const tokenPriceInUsd = Number(await getPrice(symbol));
  const tokenBalanceInUsd =
    parseFloat(ethers.utils.formatEther(balanceToken)) * tokenPriceInUsd;

  console.log("Balance in USD of Token:", tokenBalanceInUsd);

  // Sending a Transaction of Native Token
  console.log("---------- Sending a Transaction of Native Token ----------");

  const amount = ethers.BigNumber.from("1000000000000000000");
  const transaction = {
    to: "0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688",
    value: amount,
  };

  console.log(
    "Balance Actual:" + (await recoveredWallet.getBalance()).toString()
  );

  try {
    const txResponse = await recoveredWallet.sendTransaction(transaction);
    console.log("Transaction Hash", txResponse.hash);
  } catch (error) {
    console.error("Error sending the transaction", error);
  }

  // // Sending a Transaction of ERC20 Token
  // console.log("---------- Sending a Transaction of ERC20 Token ----------");

  // const erc20TokenContractAddress =
  //   "0x757251f93e5f51d6c488b9ebd2c8386abae7e3cd";
  // const erc20TokenContract = new ethers.Contract(
  //   erc20TokenContractAddress,
  //   abi,
  //   walletWithBalance
  // );

  // // Dirección del destinatario de la transferencia
  // const toAddress = "0xD3564d4C3cE55D4cB9694CDAcE90547F7e7c8628";

  // const tokenDecimals = await erc20TokenContract.decimals();

  // const actualBalance = await erc20TokenContract.balanceOf(
  //   walletWithBalance.address
  // );
  // console.log(
  //   "Actual Balance of Token:",
  //   ethers.utils.formatUnits(actualBalance, tokenDecimals)
  // );

  // //   const amountToTransfer = actualBalance.div(5);
  // const amountToTransfer = ethers.utils.parseUnits("1", tokenDecimals);
  // const txResponse = await erc20TokenContract.transfer(
  //   toAddress,
  //   amountToTransfer
  // );

  // console.log("Transaction Hash Transfering ERC20 Token", txResponse.hash);
  // const balanceAfterTransfer = await erc20TokenContract.balanceOf(
  //   walletWithBalance.address
  // );
  // console.log(
  //   "Balance after Transfer:",
  //   ethers.utils.formatUnits(balanceAfterTransfer, tokenDecimals)
  // );

  console.log("-------- Getting Receipt of Transaction --------");
  try {
    // ID de la transacción para la que deseas obtener el recibo
    const txHash =
      "0x228c528fee70ff68764893462b66033001b8e7e3a3a414b04b725dc1c5356de9";

    const requestData = {
      jsonrpc: "2.0",
      method: "eth_getTransactionReceipt",
      params: [txHash],
      id: 1,
    };

    axios
      .post(EOS_RPC, requestData)
      .then((response) => {
        const receipt = response.data.result;
        console.log("Transaction Receipt:", receipt);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.error("Error getting the receipt", error);
  }
}

async function getTransactionHistory() {
  const walletAddress = "0x50D2DEC635c48f5E8CeDE341Df87c651c6cD5318";

  const url = `https://explorer.evm.eosnetwork.com/api?module=account&action=txlist&address=${walletAddress}`;

  try {
    const response = await axios.get(url);
    console.log("Historial de transacciones:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error al obtener el historial de transacciones:",
      error.message
    );
    throw error;
  }
}

async function getTokensHolding() {
  const walletAddress = "0x5e0679b7b4C32BFfcde69B5fefEa89E77564FFE1";

  const url = `https://explorer.evm.eosnetwork.com/api?module=account&action=tokenlist&address=${walletAddress}`;

  const response = await axios.get(url);
  const tokens = response.data.result;
  console.log("Tokens:", tokens);
  for (const token of tokens) {
    console.log("Token Name:", token.name);
    console.log("Token Decimals:", token.decimals);
    console.log("Token Symbol:", token.symbol);
    console.log("Token Balance:", token.balance);

    try {
      const price = await getPrice(token.symbol);
      console.log("Token Price:", price);
    } catch (error) {
      console.log("Price No Encontrado");
    }

    console.log("--------------------");
  }

  return response.data;
}

async function getEosEvmTokenMetadata() {
  const tokenList = Erc20EOSList;

  const EosEvmSupportedTokens: any = [];

  for (const token of tokenList) {
    const url = `https://explorer.evm.eosnetwork.com/api?module=token&action=getToken&contractaddress=${token}`;

    const response = await axios.get(url);
    const tokenMetadata = {
      address: response.data.result.contractAddress,
      name: response.data.result.name,
      decimals: response.data.result.decimals,
      symbol: response.data.result.symbol,
      chain: "EOSEVM",
      logoUri: "",
    };

    EosEvmSupportedTokens.push(tokenMetadata);
  }
  console.log("EosEvmSupportedTokens:", EosEvmSupportedTokens);
}

getEosEvmTokenMetadata();
//getTokensHolding();
