import Moralis from "moralis";
import dotenv from "dotenv";
dotenv.config();

const MORALIS_API_KEY = process.env.MORALIS_API_KEY as string;

async function getMoralis() {
  await Moralis.start({
    apiKey: MORALIS_API_KEY,
  });
  return Moralis;
}

const address =
  "0x4799134e3fd9ed3df9d6707a4472a5fb34cf6a01aa656fba20bfd7ffb8b58269";

async function getTransactions() {
  if (!Moralis.Core.isStarted) getMoralis();

  try {
    const response = await Moralis.AptosApi.transactions.getAccountTransactions(
      {
        network: "testnet", // mainnet can be here
        address: address,
      }
    );
    console.log("--------------------");
    console.log("Transactions of an address", response);
  } catch (e) {
    console.log(e);
  }
}

getTransactions();

async function getNfts() {
  if (!Moralis.Core.isStarted) getMoralis();
  try {
    const response = await Moralis.AptosApi.wallets.getNFTByOwners({
      limit: 10,
      ownerAddresses: [
        "0xc204dc1e53d16ac8c140b42dc07bb1c64bdfa995f4f22743fd4e1c160e572d17", // insert your address here
      ],
      network: "mainnet",
    });

    console.log("--------------------");
    console.log("NFTs of User:", response.result);
  } catch (e) {
    console.error(e);
  }
}

getNfts();

// ALL COINS (including APTOS)
async function getCoinsBalances() {
  if (!Moralis.Core.isStarted) getMoralis();
  try {
    const response = await Moralis.AptosApi.wallets.getCoinBalancesByWallets({
      limit: 10,
      ownerAddresses: [address],
      network: "testnet", // mainnet can be here
    });
    console.log("--------------------");
    console.log("ALL COINS BALANCE: ");
    console.log(JSON.stringify(response.result, null, 2));
  } catch (e) {
    console.error(e);
  }
}

getCoinsBalances();

// APTOS COIN ONLY
async function getAptosBalance() {
  if (!Moralis.Core.isStarted) getMoralis();
  try {
    // APTOS COIN HASH (you can insert any other coinTypeHash)
    const coinTypeHash =
      "91ceb1308a98389691e05158b07ed5f079ab78461a6bb8d5a4054b1bb5cb8bb6";

    const response = await Moralis.AptosApi.wallets.getCoinBalancesByWallets({
      limit: 10,
      ownerAddresses: [address],
      network: "testnet", // mainnet can be here
      coinTypeHashWhitelist: [coinTypeHash],
    });
    console.log("--------------------");
    console.log("APTOS BALANCE: ");
    console.log(JSON.stringify(response.result, null, 2));
  } catch (e) {
    console.error(e);
  }
}

getAptosBalance();
