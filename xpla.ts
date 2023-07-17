import fetch from "isomorphic-fetch";
import {
  Coins,
  LCDClient,
  MnemonicKey,
  MsgExecuteContract,
  MsgSend,
} from "@xpla/xpla.js";
import dotenv from "dotenv";
dotenv.config();

async function xpla() {
  // Fetching Gas Prices
  const gasPrices = await fetch("https://cube-fcd.xpla.dev/v1/txs/gas_prices", {
    redirect: "follow",
  });
  const gasPricesJson = await gasPrices.json();
  const gasPricesCoins = new Coins(gasPricesJson);

  // Configure LCD Client
  const lcd = new LCDClient({
    URL: "https://cube-lcd.xpla.dev/", // Use "https://dimension-lcd.xpla.dev" for prod
    chainID: "cube_47-5", // Use "dimension_37-1" for production
    gasPrices: gasPricesCoins,
    gasAdjustment: "1.5", // Increase gas price slightly so transactions go through smoothly.
  });
  console.log("-------- Getting Gas Prices  --------");
  console.log("XPA Gas Prices:", gasPricesJson);
  console.log("XPA Gas Prices Coins:", gasPricesCoins);

  // Creating a New Wallet (Cube is the Testnet)

  const mk = new MnemonicKey();
  const walletCreated = lcd.wallet(mk);
  // @ts-ignore
  const walletCreatedAddress = walletCreated.key.publicKey?.key;
  console.log("-------- Creating a Wallet from the code  --------");
  console.log("XPA Wallet Created Address:", walletCreatedAddress);
  console.log("XPA Wallet Created Access Key:", walletCreated.key.accAddress);

  // Wallet Created using the Chrome Extension
  //Address: xpla18mjnnevs8xd6vfqkjfny7g47sdk4mpharke3k2;
  // Recover a Wallet
  const mnemonicKey = new MnemonicKey({
    mnemonic: process.env.CUBE_SEED_PHRASE,
  });
  const wallet = lcd.wallet(mnemonicKey);
  // @ts-ignore
  const walletAddress = wallet.key.publicKey?.key;
  console.log("-------- Recovering a Wallet --------");
  console.log("XPA Wallet Recovered:", walletAddress);
  const recoveredAccountAccesKey = wallet.key.accAddress;
  console.log("Recovered Wallet Access Key", recoveredAccountAccesKey);

  // Get Native Balance
  const [balance] = await lcd.bank.balance(recoveredAccountAccesKey);
  console.log("-------- Get Balance of a Native Token --------");
  // @ts-ignore
  console.log("Balance of Wallet (Native):", balance._coins.axpla);

  // Get Token Balance
  const tokenAddress =
    "xpla14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s525s0h";
  const walletAdd =
    "xpla104yd6mjyfx90swm022h9t37g2c2ar2w7zkcee5qlkrfrdge0ka9qhesxhp";  // Acount Random with balance
  const response = await lcd.wasm.contractQuery(tokenAddress, {
    balance: { address: walletAdd },
  });

  console.log("-------- Get Balance of a Token --------");
  console.log("Token Balance:", response);

  // Get Tx Status
  const hash =
    "193F3C77C4A87026814AB9E9907717C25E43B06BAD0B30FC8858798ECD1E61BB";
  const txInfo = await lcd.tx.txInfo(hash);
  console.log("-------- Get Tx Info --------");
  console.log("Tx Information:", txInfo);

  // Sending Native Token
  // Transfer 0.1 XPLA.
  const send = new MsgSend(
    recoveredAccountAccesKey,
    "xpla1a3n4gcx8c8rp9uvrkg9y9cxtcuxh5wt0dz6z22",
    { axpla: "100000000000000000" }
  );

  const tx = await wallet.createAndSignTx({ msgs: [send] });
  const result = await lcd.tx.broadcast(tx);

  console.log("-------- Sending Native Token --------");
  console.log("Tx Send Result:", result);

  // Sending Token Script
  const tokenContractAddress =
    "xpla1v2ezcmgzmvwdtp9m0nyfy38p85dnkn0excnyy6dqylm65fhft0qsrzmktv";

  const cw20Send = new MsgExecuteContract(
    recoveredAccountAccesKey,
    tokenContractAddress,
    {
      transfer: {
        amount: "100000000000000000",
        recipient: "xpla1a3n4gcx8c8rp9uvrkg9y9cxtcuxh5wt0dz6z22", //  Who receives the tokens
      },
    }
  );

  const tokenTx = await wallet.createAndSignTx({ msgs: [cw20Send] });
  const tokenTxResult = await lcd.tx.broadcast(tokenTx);
  console.log("-------- Sending CW20Token --------");
  console.log("Token Tx Result:", tokenTxResult);
}

xpla();
//swapping();

async function swapping() {
  // Fetching Gas Prices
  const gasPrices = await fetch("https://cube-fcd.xpla.dev/v1/txs/gas_prices", {
    redirect: "follow",
  });
  const gasPricesJson = await gasPrices.json();
  const gasPricesCoins = new Coins(gasPricesJson);

  // Configure LCD Client
  const lcd = new LCDClient({
    URL: "https://cube-lcd.xpla.dev/", // Use "https://dimension-lcd.xpla.dev" for prod
    chainID: "cube_47-5", // Use "dimension_37-1" for production
    gasPrices: gasPricesCoins,
    gasAdjustment: "1.5", // Increase gas price slightly so transactions go through smoothly.
  });

  const mk = new MnemonicKey({
    mnemonic: process.env.CUBE_SEED_PHRASE,
  });

  const wallet = lcd.wallet(mk);

  // XPLA <> MGRTD-TWO
  // It is necessary to search the pool address in dezwap?
  // https://app.dezswap.io/
  const pool =
    "xpla1kgrjd9gazaucfwk5hmz99hruflkjsm57k4529sw2tx5p9l8x6ykqrsg4wy";
  const xplaAmount = 1000000000000000000; //

  // Fetch the decimal of each asset in the pool and simulation result with `xplaAmount`.
  //@ts-ignore
  const { asset_decimals: assetDecimals } = await lcd.wasm.contractQuery(pool, {
    pair: {},
  });

  // @ts-ignore
  const { return_amount: returnAmount } = await lcd.wasm.contractQuery(
    // Query
    pool,
    {
      simulation: {
        offer_asset: {
          info: {
            native_token: {
              denom: "axpla",
            },
          },
          amount: `${xplaAmount}`,
        },
      },
    }
  );

  // Calculate belief price using pool balances.
  const beliefPrice = (
    xplaAmount /
    Math.pow(10, assetDecimals[0]) /
    (returnAmount / Math.pow(10, assetDecimals[1]))
  ).toFixed(assetDecimals[0]);

  console.log("-------- Swapping --------");
  console.log("Belief Price of Swapping:", beliefPrice);

  // Swap 1 XPLA to MGRTD-TWO with 1% slippage tolerance.
  // Creating a Swap Message
  const swapMsg = new MsgExecuteContract(
    wallet.key.accAddress,
    pool,
    {
      swap: {
        max_spread: "0.01",
        offer_asset: {
          info: {
            native_token: {
              denom: "axpla",
            },
          },
          amount: `${xplaAmount}`,
        },
        belief_price: beliefPrice,
      },
    },
    new Coins({ axpla: `${xplaAmount}` })
  );

  // Sending Tx
  const tx = await wallet.createAndSignTx({ msgs: [swapMsg] });
  const result = await lcd.tx.broadcast(tx);

  console.log("Swapping Tx Response", result);
}
