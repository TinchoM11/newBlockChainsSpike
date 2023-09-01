// SAME WALLET THAT FOR OTHER EVM CHAINS.
// With the Same PK, you can use the same wallet on all EVM chains.
// So we have the same address for AURORA and Ethereum.

require("dotenv").config();
import { ethers } from "ethers";
import axios from "axios";
import { getPrice } from "./pricesApi";

const AURORA_RPC = process.env.AURORA_RPC as string;
const AURORA_TESTNET_RPC = process.env.AURORA_INFURA_TESTNET_RPC as string;
const AURORA_PK = process.env.AURORA_PK as string;

const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint256)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

async function main() {
  const BaseUrl = `https://explorer.testnet.aurora.dev/api`;
  const provider = new ethers.providers.JsonRpcProvider(AURORA_TESTNET_RPC);

  // Creation of a Wallet
  const wallet = ethers.Wallet.createRandom();
  console.log("Address: " + wallet.address);
  console.log("Private Key: " + wallet.privateKey);

  // Recovery of a Wallet
  const recoveredWallet = new ethers.Wallet(AURORA_PK, provider);
  console.log("Address Recovered: " + recoveredWallet.address);

  // Get Native Balance
  console.log("                                         ");
  console.log("-----------------------------------------");
  console.log("---------- Get Native Balance ----------");
  console.log("-----------------------------------------");
  console.log("-----------------------------------------");
  const response = await axios.get(
    `${BaseUrl}?module=account&action=eth_get_balance&address=${recoveredWallet.address}`
  );
  const balance = ethers.BigNumber.from(response.data.result);
  console.log("Balances of Wallet", recoveredWallet.address);
  console.log("Balance in Hex:", balance);
  console.log("Balance: " + ethers.utils.formatEther(balance));
  const auroraPrice = Number(await getPrice("ETH"));
  const nativeBalanceInUsd =
    parseFloat(ethers.utils.formatEther(balance)) * auroraPrice;
  console.log("Balance in USDC:", nativeBalanceInUsd);
  // Get Balance of a Token
  console.log("                                         ");
  console.log("-----------------------------------------");
  console.log("-------- Get Balance of a Token ---------");
  console.log("-----------------------------------------");
  console.log("-----------------------------------------");
  const contractAddress = "0x3dcB6AdF46E4d854E94719b6ed9cfab6939cC1Cb";

  const getToken = await axios.get(
    `${BaseUrl}?module=token&action=getToken&contractaddress=${contractAddress}`
  );

  const tokenMetadata = getToken.data.result;
  console.log("Token Metadata", tokenMetadata);

  const addressWithUSDC = "0x8F791d611D71699B76C03857A51D7B7E5E66f01E";

  const tokenBalanceResponse = await axios.get(
    `${BaseUrl}?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${addressWithUSDC}`
  );

  const tokenBalance = tokenBalanceResponse.data.result;
  console.log("Token Balance in Hex:", tokenBalance);

  const decimals = tokenMetadata.decimals;
  const symbol = tokenMetadata.symbol;

  console.log(
    `Balance of ${symbol}: ${ethers.utils.formatUnits(tokenBalance, decimals)}`
  );

  const tokenPriceInUsd = Number(await getPrice(symbol));
  console.log("Token Price in USD:", tokenPriceInUsd);
  const tokenBalanceInUsd =
    parseFloat(ethers.utils.formatUnits(tokenBalance, decimals)) *
    tokenPriceInUsd;

  console.log("Balance in USD of Token:", tokenBalanceInUsd);

  // Fetching All tokens for a Wallet
  console.log("                                         ");
  console.log("-----------------------------------------");
  console.log("--- Fetching All Tokens Owned By Owner --");
  console.log("-----------------------------------------");
  console.log("-----------------------------------------");

  const getAllTokens = await axios.get(
    `${BaseUrl}?module=account&action=tokenlist&address=${addressWithUSDC}`
  );

  console.log("All Tokens:", getAllTokens.data.result);

  // Sending a Transaction of Native Token
  // console.log("                                         ");
  // console.log("-----------------------------------------");
  // console.log("- Sending a Transaction of Native Token -");
  // console.log("-----------------------------------------");
  // console.log("-----------------------------------------");

  // const amount = ethers.BigNumber.from("10000000000000");
  // const transaction = {
  //   to: "0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688",
  //   value: amount,
  // };

  // console.log(
  //   "Balance Actual:" + (await recoveredWallet.getBalance()).toString()
  // );

  // let txHash = "";
  // try {
  //   const txResponse = await recoveredWallet.sendTransaction(transaction);
  //   txHash = txResponse.hash;
  //   console.log("Transaction Hash", txHash);
  // } catch (error) {
  //   console.error("Error sending the transaction", error);
  // }

  console.log("                                         ");
  console.log("-----------------------------------------");
  console.log("-------- Getting Receipt of Transaction --------");
  console.log("-----------------------------------------");
  console.log("-----------------------------------------");
  let searchedHash =
    "0xa23c35b98955f5710066731e42dba4b0863b4cd2f695c673664b94a19ca8134a";
  try {
    const receipt = await provider.getTransactionReceipt(searchedHash);
    console.log("Receipt:", receipt);
  } catch (error) {
    console.error("Error getting the receipt", error);
  }

  // With the API Method
  const txReceiptWithApiCall = await axios.get(
    `${BaseUrl}?module=transaction&action=getstatus&txhash=${searchedHash}`
  );

  console.log("Receipt with API Call:", txReceiptWithApiCall.data.result);

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
}

main();
