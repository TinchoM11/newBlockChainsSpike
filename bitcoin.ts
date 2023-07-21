// @ts-nocheck
const { PrivateKey } = require("bitcore-lib");
const { mainnet, testnet } = require("bitcore-lib/lib/networks");
const Mnemonic = require("bitcore-mnemonic");
const sendBitcoin = require("./send.bitcoin");

const createWallet = async (network: string = testnet) => {
  // This will create a Legacy Wallet (1 PK = 1 Address)
  var privateKey = new PrivateKey();
  var address = privateKey.toAddress(network);

  console.log("Private Key:", privateKey.toString());
  console.log("Address:", address.toString());

  // Private Key: febad1d976bfb2c981ee692.............
  // Address: mmoGnzGcM3Y2DjYB3TCCax5Q34XyXtUNFb

  return {
    privateKey: privateKey.toString(),
    address: address.toString(),
  };
};

/**
 A Hierarchical Deterministic (HD) wallet is the term used to describe a wallet which uses a seed to derive public and private keys
 You can recover then your wallet with the seed phrase or private key
 **/
const createHDWallet = async (network: string = testnet) => {
  let passPhrase = new Mnemonic(Mnemonic.Words.ENGLISH);

  // Extended Private Key
  let xpriv = passPhrase.toHDPrivateKey(passPhrase.toString(), network);

  console.log("Public Key", xpriv.xpubkey);
  console.log("Private Key", xpriv.privateKey.toString());
  console.log("Address", xpriv.publicKey.toAddress().toString());
  console.log("Mnemonic", passPhrase.toString());

  // Public Key tpubD6NzVbkrYhZ4Ynd7MZHBAd1BmWNVGW4Kng2WuQNTNXafQBd9LkMQzQDzps4MwTenFAx7wjrpsEszab2iQVajU9PhsJqMTaMEThoY98P4Eq3
  // Private Key c3e8e7b37495c8963c8587f0ae5..................
  // Address myZvykScusEBvp6TE2WQqhF72x48wNitgk
  // Mnemonic army sad depend boat short...............

  return {
    xpub: xpriv.xpubkey,
    privateKey: xpriv.privateKey.toString(),
    address: xpriv.publicKey.toAddress().toString(),
    mnemonic: passPhrase.toString(),
  };
};

const sendBTC = () => {
  sendBitcoin("myZvykScusEBvp6TE2WQqhF72x48wNitgk", 0.0001)
    .then((result) => {
      console.log("Transaction Hash:", result);
    })
    .catch((error) => {
      console.log(error);
    });
};

//createHDWallet(testnet);
//createWallet(testnet);
sendBTC();
