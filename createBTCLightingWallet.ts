// @ts-nocheck
const { createSeed, createWallet } = require("ln-service");

const { authenticatedLndGrpc } = require("lightning");

async function create() {
  try {
    const { lnd } = authenticatedLndGrpc({
      cert: "base64 encoded tls.cert file",
      macaroon: "base64 encoded admin.macaroon file",
      socket: "127.0.0.1:10009",
    });

    const { seed } = await createSeed({ lnd });
    alert("Seed: " + seed);
    const wallet = await createWallet({ lnd, seed, password: "123456" });
    console.log(wallet);
  } catch (error) {
    console.log(error);
  }
}

create();
