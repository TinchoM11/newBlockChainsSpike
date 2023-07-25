// import { Api, JsonRpc } from "eosjs";
// import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig"; // development only
// require("dotenv").config();

// const PK = process.env.PK as string;

// const privateKeys = [PK];

// const signatureProvider = new JsSignatureProvider(privateKeys);
// const rpc = new JsonRpc("https://jungle4.cryptolions.io:443"); // This is for TESTNET
// //Taken from https://monitor.jungletestnet.io/#home
// // Mainnet api endpoints https://eos.antelope.tools/endpoints

// const api = new eosjs_api.Api({ rpc, signatureProvider }); //required to submit transactions

// async function eos() {
//   console.log(signatureProvider);
//   console.log(rpc);

//   // Get BLock Information
//   const info = await rpc.get_block(1);
// }

import { Api, JsonRpc, RpcError } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig";
import { TextDecoder, TextEncoder } from "text-encoding";

const defaultPrivateKey = "5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr"; // Tester
const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
const rpc = new JsonRpc("http://wax.greymass.com", { fetch });

const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
});

async function main() {
  /// GET LAST BLOCK NUMBER

  try {
    let info = await rpc.get_info();
    console.log(
      "Last Block Number:",
      await rpc.get_block(info.last_irreversible_block_num)
    );
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}
main();
