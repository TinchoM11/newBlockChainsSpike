import { use, ZkEvmClient } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-ethers";
import { providers, Wallet } from "ethers";

// install web3 plugin
use(Web3ClientPlugin);

const parentProvider = new providers.JsonRpcProvider("https://zkevm-rpc.com");
const childProvider = new providers.JsonRpcProvider(
  "https://rpc.public.zkevm-test.net"
);

async function getBalance() {
  const zkEvmClient = new ZkEvmClient();

  await zkEvmClient.init({
    network: "testnet",
    version: "blueberry",
    parent: {
      provider: parentProvider,
      defaultConfig: {
        from: "0xF8B56939fF7246142211Ab7b136EB2Ea061046e5",
      },
    },
    child: {
      provider: childProvider,
      defaultConfig: {
        from: "0xF8B56939fF7246142211Ab7b136EB2Ea061046e5",
      },
    },
  });
  const childERC20Token = zkEvmClient.erc20(
    "0x814071f7C9AacFEb6bf9cB6079FDB48db698D93D"
  );
  const balance = await childERC20Token.getBalance(
    "0xad4a9c71b7cba3fc5154e1c17c0b6fa06e4038ba"
  );

  console.log("Balance of Specific Address:");
  console.log(balance.toString());
}

// Continue testing, something with RPC is not working
getBalance();
