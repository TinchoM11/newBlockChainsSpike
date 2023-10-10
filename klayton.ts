import { ethers, getDefaultProvider } from "ethers";
import dotenv from "dotenv";
import axios from "axios";
import { covalentGetERC20Balances, covalentGetNFTBalances } from "./covalentHq";
import { getDFKTokenPrice } from "./dexScreener";
dotenv.config();

const PK = process.env.PK as string;
const KLAYTON_RPC = process.env.KLAYTON_RPC_MAINNET as string;
const provider = new ethers.providers.JsonRpcProvider(KLAYTON_RPC);

const getBalance = async () => {
  const balance = await provider.getBalance(
    "0xc5e0c5d8132e27161e1272b2bde516584d58c53c",
    "latest"
  );

  // Balance of Specific Address:
  console.log("Balance of Specific Address on KLAYTON:");
  console.log(balance.toString());
};

getBalance();

covalentGetERC20Balances(
  "0x2c081f2ee4ac7c695caf6ae0fcb83ca4edd0f61f",
  "klaytn-mainnet"
);
