const { JsonRpc } = require('eosjs');
const fetch = require('node-fetch');
const rpc = new JsonRpc('https://api.eosnewyork.io/', { fetch });

async function main() {
  try {
    let info = await rpc.get_info();
    console.log(await rpc.get_block(info.last_irreversible_block_num));
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}
main();