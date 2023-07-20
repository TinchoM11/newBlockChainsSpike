// SAME WALLET THAT FOR OTHER EVM CHAINS.
// With the Same PK, you can use the same wallet on all EVM chains.
// So we have the same address for Metis and Ethereum.

require("dotenv").config();
import { ethers } from "ethers";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { getPrice } from "./pricesApi";

const RPC_TESTNET = process.env.METIS_TESTNET_RPC as string;
const PK_TESTNET = process.env.PK_METIS as string;

const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint256)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

const provider = new ethers.providers.JsonRpcProvider(RPC_TESTNET);

async function main() {
  // Creation of a Wallet
  const wallet = ethers.Wallet.createRandom();
  console.log("Address: " + wallet.address);
  console.log("Private Key: " + wallet.privateKey);

  // Recovery of a Wallet
  const recoveredWallet = new ethers.Wallet(wallet.privateKey, provider);
  console.log("Address Recovered: " + recoveredWallet.address);

  // Get Native Balance
  console.log("---------- Get Native Balance ----------");
  const walletWithBalance = new ethers.Wallet(PK_TESTNET, provider);
  const balance = await provider.getBalance(walletWithBalance.address);
  console.log("Balance: " + ethers.utils.formatEther(balance));
  const metisPrice = Number(await getPrice("METIS"));
  const nativeBalanceInUsd =
    parseFloat(ethers.utils.formatEther(balance)) * metisPrice;
  console.log("Balance in USDC:", nativeBalanceInUsd);
  // Get Balance of a Token
  console.log("---------- Get Balance of a Token ----------");
  const contractAddress = "0x176dd192f2f6505ad99204ff83561bac6d7f6d4b";

  const contract = new ethers.Contract(contractAddress, abi, provider);
  const balanceToken = await contract.balanceOf(
    "0x896Fb21254AfafaA5Ed89cCbD9d3aa507F11BEc5"
  );
  const decimals = await contract.decimals();
  console.log("Decimals of Token: " + decimals);
  const symbol = await contract.symbol();
  console.log(
    `Balance of ${symbol}: ${ethers.utils.formatUnits(balanceToken, decimals)}`
  );

  const tokenPriceInUsd = Number(await getPrice(symbol));
  const tokenBalanceInUsd =
    parseFloat(ethers.utils.formatEther(balanceToken)) * tokenPriceInUsd;

  console.log("Balance in USD of Token:", tokenBalanceInUsd);

  // Sending a Transaction of Native Token
  console.log("---------- Sending a Transaction of Native Token ----------");

  const amount = ethers.BigNumber.from("1000000000000000"); // 0.001 METIS
  const transaction = {
    to: "0xD3564d4C3cE55D4cB9694CDAcE90547F7e7c8628",
    value: amount,
  };

  console.log(
    "Balance Actual:" + (await walletWithBalance.getBalance()).toString()
  );

  try {
    const txResponse = await walletWithBalance.sendTransaction(transaction);
    console.log("Transaction Hash", txResponse.hash);
  } catch (error) {
    console.error("Error sending the transaction", error);
  }

  // Sending a Transaction of ERC20 Token
  console.log("---------- Sending a Transaction of ERC20 Token ----------");

  const erc20TokenContractAddress =
    "0x757251f93e5f51d6c488b9ebd2c8386abae7e3cd";
  const erc20TokenContract = new ethers.Contract(
    erc20TokenContractAddress,
    abi,
    walletWithBalance
  );

  // Dirección del destinatario de la transferencia
  const toAddress = "0xD3564d4C3cE55D4cB9694CDAcE90547F7e7c8628";

  const tokenDecimals = await erc20TokenContract.decimals();

  const actualBalance = await erc20TokenContract.balanceOf(
    walletWithBalance.address
  );
  console.log(
    "Actual Balance of Token:",
    ethers.utils.formatUnits(actualBalance, tokenDecimals)
  );

  //   const amountToTransfer = actualBalance.div(5);
  const amountToTransfer = ethers.utils.parseUnits("1", tokenDecimals);
  const txResponse = await erc20TokenContract.transfer(
    toAddress,
    amountToTransfer
  );

  console.log("Transaction Hash Transfering ERC20 Token", txResponse.hash);
  const balanceAfterTransfer = await erc20TokenContract.balanceOf(
    walletWithBalance.address
  );
  console.log(
    "Balance after Transfer:",
    ethers.utils.formatUnits(balanceAfterTransfer, tokenDecimals)
  );

  console.log("-------- Getting Receipt of Transaction --------");
  try {
    const receipt = await provider.getTransactionReceipt(txResponse.hash);
    if (receipt.status === 1) {
      console.log("Transaction Success!!!");
    } else {
      console.log("Transaction Failed");
    }
    console.log("Receipt: " + JSON.stringify(receipt, null, 2));
  } catch (error) {
    console.error("Error getting the receipt", error);
  }

  /////////// ThirdWeb SDK ///////////

  const sdk = ThirdwebSDK.fromPrivateKey(
    PK_TESTNET,
    {
      chainId: 599, // Chain ID of the network
      rpc: ["https://goerli.gateway.metisdevops.link	"],

      nativeCurrency: {
        decimals: 18,
        name: "METIS",
        symbol: "METIS",
      },
      shortName: "METIS", // Display value shown in the wallet UI
      slug: "Metis", // Display value shown in the wallet UI
      testnet: true, // Boolean indicating whether the chain is a testnet or mainnet
      chain: "Metis", // Name of the network
      name: "Metis Goerli Testnet", // Name of the network
    },
    {
      clientId: process.env.CLIENT_ID,
      secretKey: process.env.SECRET_KEY,
    }
  );

  // Get Balance using ThirdWeb SDK
  console.log("");
  console.log("-----------------------------------------");
  console.log("-----------------------------------------");
  console.log("---------- USING ThirdWeb SDK ----------");
  console.log("-----------------------------------------");
  console.log("-----------------------------------------");
  console.log("---------- Get Balance using ThirdWeb SDK ----------");
  const balanceThirdWeb = await sdk.wallet.balance();
  console.log("Balance: " + JSON.stringify(balanceThirdWeb, null, 2));

  // Transfer using ThirdWeb SDK
  console.log("---------- Transfer Native Token using ThirdWeb SDK ----------");
  const txResult = await sdk.wallet.transfer(
    "0xD3564d4C3cE55D4cB9694CDAcE90547F7e7c8628",
    0.1
  );
  console.log("Transaction Result: " + JSON.stringify(txResult, null, 2));

  // Transfer Token using ThirdWeb SDK
  console.log("---------- Transfer Token using ThirdWeb SDK ----------");
  const txResultToken = await sdk.wallet.transfer(
    "0xD3564d4C3cE55D4cB9694CDAcE90547F7e7c8628",
    1,
    "0x757251f93e5f51d6c488b9ebd2c8386abae7e3cd"
  );
  console.log(
    "Token Transaction Result: " + JSON.stringify(txResultToken, null, 2)
  );
}

main();
