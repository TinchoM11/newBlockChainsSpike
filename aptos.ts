import {
  Provider,
  Network,
  CoinClient,
  AptosClient,
  AptosAccount,
  FaucetClient,
} from "aptos";

import axios from "axios";

export const provider = new Provider(Network.TESTNET);
export const NODE_URL = "https://fullnode.testnet.aptoslabs.com";
export const FAUCET_URL = "https://faucet.testnet.aptoslabs.com";
const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);

const client = new AptosClient(NODE_URL);
const coinClient = new CoinClient(client);

// 0x4799134e3fd9ed3df9d6707a4472a5fb34cf6a01aa656fba20bfd7ffb8b58269
const createdAccountSigningKey = Uint8Array.from([
  57, 171, 168, 155, 184, 180, 200, 49, 36, 101, 95, 179, 36, 219, 179, 156, 83,
  1, 196, 133, 199, 98, 179, 16, 180, 229, 77, 131, 72, 114, 106, 79, 90, 147,
  27, 227, 184, 11, 139, 235, 79, 16, 180, 173, 234, 148, 0, 235, 50, 21, 122,
  183, 211, 144, 74, 225, 231, 133, 113, 179, 79, 177, 224, 72,
]);

const privateKeyHex =
  "0x39aba89bb8b4c83124655fb324dbb39c5301c485c762b310b4e54d8348726a4f";

const secondAccountSigningKey = Uint8Array.from([
  157, 192, 91, 100, 147, 134, 165, 106, 136, 138, 184, 178, 192, 2, 167, 182,
  36, 202, 138, 90, 168, 80, 182, 10, 221, 190, 25, 42, 19, 202, 96, 14, 2, 255,
  92, 76, 186, 202, 53, 64, 58, 74, 189, 14, 99, 183, 224, 126, 74, 31, 97, 168,
  118, 248, 114, 208, 194, 231, 162, 161, 37, 85, 25, 55,
]);

async function aptos() {
  // Creating LOCAL Accounts
  const secondAccount = new AptosAccount();
  console.log("New Account", secondAccount);
  // Recovering Account
  const recoveredAccount = new AptosAccount(
    undefined,
    "0x4799134e3fd9ed3df9d6707a4472a5fb34cf6a01aa656fba20bfd7ffb8b58269"
  );
  //const secondAccount = new AptosAccount(secondAccountSigningKey);

  console.log(
    "Recovered account address:",
    recoveredAccount.address().toString()
  );

  // This will return the Private Key. With this PK I achieved to import it on an external wallet
  console.log("RecoveredAccount Info:", recoveredAccount.toPrivateKeyObject());

  // Creating Blockchain Accounts (Faucet)
  await faucetClient.fundAccount(secondAccount.address(), 0);
  // await faucetClient.fundAccount(recoveredAccount.address(), 100_000_000);

  // Reading Balances
  console.log(
    `New Account Balance: ${await coinClient.checkBalance(secondAccount)}`
  );
  console.log(
    `Recovered Account Balance: ${await coinClient.checkBalance(
      recoveredAccount
    )}`
  );

  // Transfering Funds (From, To, Amount, Options)
  let txnHash = await coinClient.transfer(
    recoveredAccount,
    secondAccount,
    100_000,
    {
      gasUnitPrice: BigInt(100),
    }
  );
  console.log("Transfer Transaction Hash:", txnHash);
  // https://devnet.aptoscan.com/ for checking the transaction hash

  console.log(" AFTER TX --------------------");
  // Reading Balances After TXN
  console.log(
    `New Account Balance After TX: ${await coinClient.checkBalance(secondAccount)}`
  );
  console.log(
    `Recovered Account Balance After TX: ${await coinClient.checkBalance(
      recoveredAccount
    )}`
  );

  // Checking Transaction Status

  // const status = await provider.waitForTransaction(
  //   "0x98bd88ebc3517c81775e7db9f825522dcbeb0f00b01d648d4c5325f15b8ff82c",
  //   {
  //     checkSuccess: true,
  //     timeoutSecs: 60,
  //   }
  // );

  // console.log(status);

  const options = {
    method: "GET",
    url: `https://fullnode.testnet.aptoslabs.com/v1/transactions/by_hash/0x98bd88ebc3517c81775e7db9f825522dcbeb0f00b01d648d4c5325f15b8ff82c`,
    headers: { Accept: "application/json, application/x-bcs" },
  };

  try {
    const { data } = await axios.request(options);
    console.log("TransactionData", data.sender);
  } catch (error) {
    console.error("Error Getting Tx Data", error);
  }
}

aptos();
