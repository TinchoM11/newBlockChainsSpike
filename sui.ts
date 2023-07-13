import {
  JsonRpcProvider,
  Connection,
  Ed25519Keypair,
  RawSigner,
} from "@mysten/sui.js";

// Construct your connection:
const connection = new Connection({
  fullnode: "https://fullnode.mainnet.sui.io",
  faucet: "https://faucet.devnet.sui.io/gas",
});

// connect to a custom RPC server
const provider = new JsonRpcProvider(connection);

async function sui() {
  // Create an account
  // Generate a new Ed25519 Keypair
  const keypair = new Ed25519Keypair();
  const signer = new RawSigner(keypair, provider);
  console.log("Signer:", signer);
  console.log("Address:", keypair.getPublicKey().toSuiAddress());

  // TODO - How do I get the private key?
  console.log("KeyPair:", keypair);
//   const toJson = JSON.parse(JSON.stringify(keypair));
//   console.log("toJson:", toJson.keypair);
  console.log("Private Key:", keypair.getKeyScheme());

  // Get Objects for an specific user
  const objects = await provider.getOwnedObjects({
    owner: "0x89f91caed050e6c61846f1c843fdcf11a3399a1002bd357d783414be35ffe8d4",
  });
  console.log("--------------------");
  console.log("Objects Owned by Address:", JSON.stringify(objects, null, 2));

  // Get Object Details (can be 1 or more)
  const txn = await provider.getObject({
    id: "0xf72706aecd3a010663ef98d33015467f67d7c1f630f67729a329083d17fe0d54",
    options: { showContent: true },
  });
  console.log("--------------------");
  console.log("Object Details:", JSON.stringify(txn, null, 2));

  const txns = await provider.multiGetObjects({
    ids: [
      "0xf72706aecd3a010663ef98d33015467f67d7c1f630f67729a329083d17fe0d54",
      "0xf3a911658513a3abdc27d65e707492c04e1cd78133efb2944e2ae204f1177727",
    ],
    options: { showType: true },
  });
  console.log("--------------------");
  console.log("Multiple Objects:", JSON.stringify(txns, null, 2));

  // Get Transactions
  const getTxn = await provider.getTransactionBlock({
    digest: "EALBcTKBxExwZ1TWogoAQHNBDiNmW1rN2itW2YVVye5M",
    options: {
      showEffects: true,
      showInput: false,
      showEvents: false,
      showObjectChanges: false,
      showBalanceChanges: false,
    },
  });
  console.log("--------------------");
  console.log("Transaction Details:", JSON.stringify(getTxn, null, 2));
  console.log("--------------------");
  console.log("Transaction Status:", getTxn.effects?.status.status);

  // Get Balances of Specific Coin for an address
  const coins = await provider.getCoins({
    owner: "0x9f3d0ee27155f98fd0431cde59a227c8823f2d3002e05794642e45bfa0557265",
    coinType:
      "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
  });
  console.log("--------------------");
  console.log("Coins of User:", JSON.stringify(coins, null, 2));

  // If coin type is not specified, it defaults to 0x2::sui::SUI
  const suiBalance = await provider.getCoins({
    owner: "0x9f3d0ee27155f98fd0431cde59a227c8823f2d3002e05794642e45bfa0557265",
  });
  console.log("--------------------");
  console.log("SUI Balance:", JSON.stringify(suiBalance, null, 2));

  // Fetch all coin objects owned by an address:
  const allCoins = await provider.getAllCoins({
    owner: "0x9f3d0ee27155f98fd0431cde59a227c8823f2d3002e05794642e45bfa0557265",
  });
  console.log("--------------------");
  console.log("All Coins:", JSON.stringify(allCoins, null, 2));

  //Fetch the total coin balance for one coin type, owned by an address:
  const coinBalance = await provider.getBalance({
    owner: "0x9f3d0ee27155f98fd0431cde59a227c8823f2d3002e05794642e45bfa0557265",
    coinType:
      "0x47f389127ad7bfdd5b64dd532ba5e29495466c208b7ba2cc6a10a0a3a4610f3e::btcat::BTCAT",
  });
  console.log("--------------------");
  console.log("Coin Balance:", JSON.stringify(coinBalance, null, 2));

  // If coin type is not specified, it defaults to 0x2::sui::SUI
  const suiCoinBalance = await provider.getBalance({
    owner: "0x9f3d0ee27155f98fd0431cde59a227c8823f2d3002e05794642e45bfa0557265",
  });
  console.log("--------------------");
  console.log("SUI Balance:", JSON.stringify(suiCoinBalance, null, 2));
}

sui();
