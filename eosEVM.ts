// SAME WALLET THAT FOR OTHER EVM CHAINS.
// With the Same PK, you can use the same wallet on all EVM chains.
// So we have the same address for EOS EVM and Ethereum.

require("dotenv").config();
import { ethers } from "ethers";
import axios from "axios";
import { getPrice } from "./pricesApi";
import { EosEvmNetwork, EosEvmNetworkTestnet } from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const EOS_RPC = process.env.METIS_TESTNET_RPC as string;
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
  // console.log("---------- Get Balance of a Token ----------");
  // const contractAddress = "0x9fc25190bac66d7be4639268220d1bd363ca2698";

  // const contract = new ethers.Contract(contractAddress, abi, provider);
  // console.log("Contract:", contract);
  // const decimals = await contract.decimals();
  // console.log("Decimals of Token: " + decimals);
  // const symbol = await contract.symbol();
  // console.log("Symbol of Token:", symbol);

  // const balanceToken = await contract.balanceOf(
  //   "0xD3564d4C3cE55D4cB9694CDAcE90547F7e7c8628"
  // );
  // console.log(
  //   `Balance of ${symbol}: ${ethers.utils.formatUnits(balanceToken, decimals)}`
  // );

  // const tokenPriceInUsd = Number(await getPrice(symbol));
  // const tokenBalanceInUsd =
  //   parseFloat(ethers.utils.formatEther(balanceToken)) * tokenPriceInUsd;

  // console.log("Balance in USD of Token:", tokenBalanceInUsd);

  // // Sending a Transaction of Native Token
  // console.log("---------- Sending a Transaction of Native Token ----------");

  // const amount = ethers.BigNumber.from("1000000000000000"); // 0.001 METIS
  // const transaction = {
  //   to: "0xD3564d4C3cE55D4cB9694CDAcE90547F7e7c8628",
  //   value: amount,
  // };

  // console.log(
  //   "Balance Actual:" + (await walletWithBalance.getBalance()).toString()
  // );

  // try {
  //   const txResponse = await walletWithBalance.sendTransaction(transaction);
  //   console.log("Transaction Hash", txResponse.hash);
  // } catch (error) {
  //   console.error("Error sending the transaction", error);
  // }

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

  // console.log("-------- Getting Receipt of Transaction --------");
  // try {
  //   // ID de la transacción para la que deseas obtener el recibo
  //   const txHash =
  //     "0xbf6f4e6babf15af5d1c8044c9d575272d6ce932221e065393ff210bfa05096e5";

  //   const requestData = {
  //     jsonrpc: "2.0",
  //     method: "eth_getTransactionReceipt",
  //     params: [txHash],
  //     id: 1,
  //   };

  //   axios
  //     .post(EOS_RPC, requestData)
  //     .then((response) => {
  //       const receipt = response.data.result;
  //       console.log("Transaction Receipt:", receipt);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // } catch (error) {
  //   console.error("Error getting the receipt", error);
  // }

  // /////////// ThirdWeb SDK ///////////
  const sdk = ThirdwebSDK.fromPrivateKey(
    EOS_PK,
    {
      chainId: 17777, // Chain ID of the network
      rpc: [EOS_RPC],

      nativeCurrency: {
        decimals: 18,
        name: "EOS",
        symbol: "EOS",
      },
      shortName: "EOS", // Display value shown in the wallet UI
      slug: "Eos", // Display value shown in the wallet UI
      testnet: false, // Boolean indicating whether the chain is a testnet or mainnet
      chain: "Eos", // Name of the network
      name: "Eos EVM", // Name of the network
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

  console.log("---------- Get Token Balance using ThirdWeb SDK ----------");
  const tokenBalanceThirdWeb = await sdk.wallet.balance("0x9fC25190baC66D7be4639268220d1Bd363ca2698");
  console.log("Balance: " + JSON.stringify(tokenBalanceThirdWeb, null, 2));

  // Transfer using ThirdWeb SDK
  console.log("---------- Transfer Native Token using ThirdWeb SDK ----------");
  const txResult = await sdk.wallet.transfer(
    "0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688",
    0.1
  );
  console.log("Transaction Result: " + JSON.stringify(txResult, null, 2));

  // Transfer Token using ThirdWeb SDK
  // console.log("---------- Transfer Token using ThirdWeb SDK ----------");
  // const txResultToken = await sdk.wallet.transfer(
  //   "0xD3564d4C3cE55D4cB9694CDAcE90547F7e7c8628",
  //   1,
  //   "0x757251f93e5f51d6c488b9ebd2c8386abae7e3cd"
  // );
  // console.log(
  //   "Token Transaction Result: " + JSON.stringify(txResultToken, null, 2)
  // );
}

main();
