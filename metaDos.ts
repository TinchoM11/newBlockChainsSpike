import { ethers } from "ethers";
import dotenv from "dotenv";
import axios from "axios";
import { covalentGetERC20Balances, covalentGetNFTBalances } from "./covalentHq";
import { getDFKTokenPrice } from "./dexScreener";
dotenv.config();

const METADOS_PK = process.env.METADOS_PK as string;
const METADOS_RPC = process.env.METADOS_RPC as string;
const provider = new ethers.providers.JsonRpcProvider(METADOS_RPC);

const getBalance = async () => {
  const balance = await provider.getBalance(
    "0x8f444b150741d06d56931e4db73b0c9afa062ca3",
    "latest"
  );

  // Balance of Specific Address:
  console.log("Balance of Specific Address on DFK:");
  console.log(balance.toString());
};

const sendNativeToken = async () => {
  console.log("---------- Sending a Transaction of Native Token ----------");
  const walletWithBalance = new ethers.Wallet(METADOS_PK, provider);
  console.log(
    "Balance Before Transfer:" +
      (await walletWithBalance.getBalance()).toString()
  );
  const amount = ethers.BigNumber.from("1000000000000000000"); // 1 DOS
  const transaction = {
    to: "0xd852dE59984ab0DB32F85E68D080ae598aDc63d9",
    value: amount,
  };

  try {
    const txResponse = await walletWithBalance.sendTransaction(transaction);
    console.log("Transaction Hash", txResponse.hash);
  } catch (error) {
    console.error("Error sending the transaction", error);
  }
};

const sendERC20Token = async () => {
  console.log("---------- Sending a Transaction of ERC20 Token ----------");
  const userWallet = new ethers.Wallet(METADOS_PK, provider);
  const erc20TokenContractAddress =
    "0x2787E8f18da4FC2113268ce8521B7A53df2D5c35";
  const erc20TokenContract = new ethers.Contract(
    erc20TokenContractAddress,
    ERC20_ABI,
    userWallet
  );

  // Dirección del destinatario de la transferencia
  const toAddress = "0xd852dE59984ab0DB32F85E68D080ae598aDc63d9";

  const tokenDecimals = await erc20TokenContract.decimals();

  const actualBalance = await erc20TokenContract.balanceOf(userWallet.address);
  console.log("Balance", actualBalance);
  console.log(
    "Actual Balance of Token:",
    ethers.utils.formatUnits(actualBalance, tokenDecimals)
  );

  const amountToTransfer = actualBalance.div(2);
  const txResponse = await erc20TokenContract.transfer(
    toAddress,
    amountToTransfer
  );

  console.log("Transaction Hash Transfering ERC20 Token", txResponse.hash);
};

const getTxReceipt = async () => {
  // Get Transaction Receipt:
  const txReceipt = await provider.getTransactionReceipt(
    "0xfb2fc7b818009ec567ea9b8ed581cbbe411fe3f814d1653af3eaa44e8d44ce7c"
  );
  console.log("--------------------");
  console.log("Get  Transaction Receipt:");
  console.log(txReceipt);
};

export const ERC20_ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

const ERC20TokensMetaDos = [
  "0x2787E8f18da4FC2113268ce8521B7A53df2D5c35", // USDC
];

const getTokenMetadata = async () => {
  const supportedTokens: any[] = [];
  const noPricesTokens: any[] = [];

  await Promise.all(
    ERC20TokensMetaDos.map(async (tokenAddress: string) => {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        provider
      );
      try {
        const tokenSymbol = await tokenContract.symbol();
        const tokenDecimals = await tokenContract.decimals();
        const tokenName = await tokenContract.name();

        supportedTokens.push({
          name: tokenName,
          symbol: tokenSymbol,
          address: tokenAddress,
          decimals: tokenDecimals.toString(),
        });
      } catch (error) {
        console.error("Error en token:", tokenAddress, error);
      }
    })
  );

  console.log(supportedTokens);
  console.log("Without Price:", noPricesTokens);
};

/// ************************************************* ///
/// ************************************************* ///
/// **** UNCOMMENT THE FUNCTION YOU WANT TO TEST **** ///
/// ************************************************* ///
/// ************************************************* ///

// getBalance();
//sendNativeToken();
//getTxReceipt();
//sendERC20Token();

// covalentGetERC20Balances(
//   "0xe584B655a6D3D818998670f73c9c0702B66498e2",
//   "avalanche-dos"
// );

// covalentGetNFTBalances(
//   "0xaa1e1420455efd441358802859ffe39415ce3F56",
//   "avalanche-dos"
// );

//getTokenMetadata();
