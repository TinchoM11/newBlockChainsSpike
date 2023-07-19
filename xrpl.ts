const xrpl = require("xrpl");

async function main() {
  // Connect to XRP Ledger
  // This is Testnet
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  // We can connect to MAINNET using one of the available public servers
  // Example
  {
    /* const PUBLIC_SERVER = "wss://xrplcluster.com/"
const client = new xrpl.Client(PUBLIC_SERVER)
await client.connect() */
  }

  // Creating an Account or Recovering an Account
  const test_wallet = xrpl.Wallet.generate();
  console.log("Test Wallet Created", test_wallet);

  //Response example
  //   Test Wallet Created Wallet {
  //     publicKey: 'EDC33E901331FD3592ED2F967F81FBB16DA8E7546F14AF003D8F0AB6577313140E',
  //     privateKey: 'ED0B1A250BA7E3B7926B44850BA1D731E9426BB70AE132863702A984738BCA3477',
  //     classicAddress: 'rnrorWni6BBZN7tw8832QEW6a8sCpuriu2',
  //     seed: 'sEd7rHj22cLLBbiVQfiUkoNb3DD6s1b'
  //   }

  // To recover a wallet
  const recoveredWallet = xrpl.Wallet.fromSeed(
    "sEd7rHj22cLLBbiVQfiUkoNb3DD6s1b"
  );
  console.log("Recovered Wallet", recoveredWallet);

  // Funding on Testnet
  const fundingWallet = await client.fundWallet(recoveredWallet);
  console.log("Wallet After Funding", fundingWallet);

  // Get info from the ledger about the address we just funded
  console.log("------------------ Get Account Info ------------------");
  const response = await client.request({
    command: "account_info",
    account: recoveredWallet.address,
    ledger_index: "validated",
  });
  console.log(response);

  const wallet_balance = await client.getXrpBalance(recoveredWallet.address);
  console.log("Wallet Balance", wallet_balance);

  console.log("------------------ Get NFTs of Account ------------------");

  const PUBLIC_SERVER = "wss://xrplcluster.com/";
  const mainnetClient = new xrpl.Client(PUBLIC_SERVER);
  await mainnetClient.connect();

  const responseNFT = await mainnetClient.request({
    command: "account_nfts",
    account: "rhsxg4xH8FtYc3eR53XDSjTGfKQsaAGaqm", // Wallet on mainnet with nfts
    ledger_index: "validated",
    limit: 10, // So it's not too much data
  });
  console.log(responseNFT.result.account_nfts);

  console.log(
    "------------------ Get Currencies of Account ------------------"
  );

  const responseObjects = await mainnetClient.request({
    command: "account_lines",
    account: "rhsxg4xH8FtYc3eR53XDSjTGfKQsaAGaqm", // Wallet on mainnet with nfts
    ledger_index: "validated",
  });
  console.log("Currencies of Account:", responseObjects.result);

  console.log(
    "------------------ Get Information of Transaction ------------------"
  );

  const transactionResponse = await mainnetClient.request({
    command: "tx",
    transaction:
      "46EE7FE801699D016D4200C9581ACFEF8F8C61851F83983393AE6363E11CED4F",
  });

  console.log("Transaction Info:", transactionResponse);

  // Disconnect when done (If you omit this, Node.js won't end the process)
  client.disconnect();
  mainnetClient.disconnect();
}

async function sendTransaction() {
  // Recover Wallet
  const wallet = xrpl.Wallet.fromSeed("sEd7rHj22cLLBbiVQfiUkoNb3DD6s1b");

  // Connect to XRP Ledger Testnet in this case
  // ON production we should connect to a public server
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  const wallet_balance = await client.getXrpBalance(wallet.address);
  const fundingWallet = await client.fundWallet(wallet);
  console.log("Wallet Balance", wallet_balance);

  // Prepare transaction
  const prepared = await client.autofill({
    TransactionType: "Payment",
    Account: wallet.address,
    Amount: xrpl.xrpToDrops("10"), // It has 6 zeros after this number
    Destination: "rsDoRq6CUnHZ9m7poWFGUraVrMdKYSHtTn",
  });
  const max_ledger = prepared.LastLedgerSequence;
  console.log("Prepared transaction instructions:", prepared);
  console.log("Transaction cost:", xrpl.dropsToXrp(prepared.Fee), "XRP");
  console.log("Transaction expires after ledger:", max_ledger);

  // Sign prepared instructions
  const signed = wallet.sign(prepared);
  console.log("Identifying hash:", signed.hash);
  console.log("Signed blob:", signed.tx_blob);

  // Submit signed blob --------------------------------------------------------
  const tx = await client.submitAndWait(signed.tx_blob);

  // Check transaction results -------------------------------------------------
  console.log("--------- Checking Tx Status ------------");
  console.log("Transaction result:", tx.result.meta.TransactionResult);

  console.log(
    "Balance changes:",
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  );

  client.disconnect();
}

main();
sendTransaction();
