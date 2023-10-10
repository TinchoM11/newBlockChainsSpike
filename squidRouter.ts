import axios from "axios";

// For Testnet API use this Base URL https://testnet.api.0xsquid.com/v1/
// For Mainnet API use this Base URL https://api.0xsquid.com/v1/

// Return List of All Supported Chains
async function getChains() {
  const result = await axios.get("https://api.0xsquid.com/v1/chains");
  result.data.chains.forEach((chain: any) => {
    // If chain name includes "flow" console log it
    if (chain.chainName.includes("Polygon")) {
      console.log("Flow Chain", chain);
    }
  });

  //console.log("Chains", result.data);
}

// Return List of All Supported Tokens
async function getTokens() {
  const result = await axios.get("https://api.0xsquid.com/v1/tokens");

  console.log("Tokens", result.data);
}

/* ********************************
***********************************
********** IMPORTANT NOTE *********
If you want to send or receive native tokens (i.e ETH), the sourceTokenAddress or destinationTokenAddress arguments must be set to 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
***********************************
***********************************
*/

// Creates a Route for bridging tokens between chains
async function getRoute() {
  const params = {
    fromChain: 137, // Source Chain ID
    fromToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // Token Address on Source Chain
    fromAmount: "15000000000000000000", // Amount of Tokens to Bridge (Attention to Decimals)
    toChain: 8453, // Destination Chain ID
    toToken: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // Token Address on Destination Chain
    toAddress: "0xfA73Aec7c5ABe6582636edb52165bF39566593a7", // the recipient's address
    slippage: 3, // 3 --> 3.00% slippage
  };

  const result = await axios.get("https://api.0xsquid.com/v1/route", {
    params: params,
    headers: {
      "x-integrator-id": "your-integrator-id",
    },
  });

  console.log("Route:", result.data);

  // This route returns the Transacion Request that we need to send with the user wallet (to, value, data, gas, etc)
  // If it's an ERC20 Token, we also need to "approve" the bridge contract to spend the tokens
  // Spender Address is "targetAddress" on the response
  // Example of Tx Request response.

  //   transactionRequest: {
  //     routeType: 'CALL_BRIDGE_CALL',
  //     targetAddress: '0x481A2AAE41cd34832dDCF5A79404538bb2c02bC8', // the bridge contract address
  //     data: "0x846a1bc6000000..............................", // the encoded data to be sent to the bridge contract
  //     value: '8943701823194040', // the amount of tokens to be sent to the bridge contract
  //     gasLimit: '446000',
  //     gasPrice: '5000000000',
  //     maxFeePerGas: '1500000000',
  //     maxPriorityFeePerGas: '1500000000'
  //   }
}

const getStatus = async () => {
  // For Testnet API use this URL https://testnet.api.0xsquid.com/v1/status
  // For Mainnet API use this URL https://api.0xsquid.com/v1/status
  const result = await axios.get("https://api.0xsquid.com/v1/status", {
    params: {
      transactionId:
        "0x52456976b7d327dc63cc7006c3f680e4e808f246983d1d5d5b22f39f80c0e528",
    },
    headers: {
      "x-integrator-id": "your-integrator-id",
    },
  });
  console.log("Status:", result.data);

  // The status getter will response a lot of information.
  // We need to take the "squidTransactionStatus". When it's 'success' the transaction is done.
};

getChains();

// Example of Status Response
// At the very bottom of the response, you can see the "squidTransactionStatus"
/* Status: {
    id: '0xc6b6ed43d2e29b36197a1acc711ed14eec735de8525689ab0d216f736f4ba65c_3_2011',
    status: 'destination_executed',
    gasStatus: 'gas_paid_enough_gas',
    isGMPTransaction: true,
    axelarTransactionUrl: 'https://testnet.axelarscan.io/gmp/0xc6b6ed43d2e29b36197a1acc711ed14eec735de8525689ab0d216f736f4ba65c',
    fromChain: {
      transactionId: '0xc6b6ed43d2e29b36197a1acc711ed14eec735de8525689ab0d216f736f4ba65c',
      blockNumber: 8117944,
      callEventStatus: '',
      callEventLog: [],
      chainData: {
        chainName: 'base',
        chainType: 'evm',
        rpc: 'https://goerli.base.org',
        networkName: 'Base Goerli',
        chainId: 84531,
        nativeCurrency: [Object],
        swapAmountForGas: '2000000',
        chainIconURI: 'https://raw.githubusercontent.com/axelarnetwork/axelar-satellite/main/public/assets/chains/base.logo.svg',
        blockExplorerUrls: [Array],
        chainNativeContracts: [Object],
        axelarContracts: [Object],
        squidContracts: [Object],
        estimatedRouteDuration: 1800,
        estimatedExpressRouteDuration: 20
      },
      transactionUrl: 'https://goerli.basescan.org/tx/0xc6b6ed43d2e29b36197a1acc711ed14eec735de8525689ab0d216f736f4ba65c'
    },
    toChain: {
      transactionId: '0x9af48c105a6556155eb86e9a2f552a51474ea11ff37a9a86c2ed24bb37abbbee',
      blockNumber: 32244815,
      callEventStatus: 'CrossMulticallExecuted',
      callEventLog: [ [Object] ],
      chainData: {
        chainName: 'binance',
        chainType: 'evm',
        rpc: 'https://data-seed-prebsc-2-s1.binance.org:8545',
        networkName: 'Binance Smart Chain Testnet',
        chainId: 97,
        nativeCurrency: [Object],
        swapAmountForGas: '2000000',
        chainIconURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
        blockExplorerUrls: [Array],
        chainNativeContracts: [Object],
        axelarContracts: [Object],
        squidContracts: [Object],
        estimatedRouteDuration: 150,
        estimatedExpressRouteDuration: 20
      },
      transactionUrl: 'https://testnet.bscscan.com/tx/0x9af48c105a6556155eb86e9a2f552a51474ea11ff37a9a86c2ed24bb37abbbee'
    },
    timeSpent: {
      call_confirm: 1558,
      call_approved: 1600,
      total: 1612,
      approved_executed: 12
    },
    error: {},
    squidTransactionStatus: 'success'
  }
  */

/// HOW TO SEND THOSE TRANSACTIONS REQUEST
// ****** MAKE TX WITH SMART WALLETS ****** //
/* ******************************************
IF ITS AN ERC20 TOKEN, WE NEED TO APPROVE THE BRIDGE CONTRACT FIRST
let spender = txRequest.targetAddress;
let amount = xxxxxx /// The amount of the ERC20 token to be sent to the bridge contract
const approveTx = await client.sendUserOperation(
    simpleAccount.execute(
        erc20.address,
        0,
        erc20.interface.encodeFunctionData("approve", [spender, amount])
      )

Transaction of the Bridge ITSELF
  const userOperation = await client.sendUserOperation(
    simpleAccount.execute(
      txRequest.targetAddress,
      BigNumber.from(txRequest.value).toHexString(),
      txRequest.data
    )
  );

  const userOperationHash = userOperation.userOpHash;
  const transacionHash = await userOperation.wait();

  console.log(`UserOperationHash: ${userOperationHash}`);
  console.log(`TransactionHash: ${transacionHash}`);


  ****** MAKE TX WITH SMART WALLETS ****** 
  ****************************************** 
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

const account = new ethers.Wallet(PK_EOA, provider);
console.log("Account Address:", account.address);
const nonce = await provider.getTransactionCount(account.address);
const maxFeePerGas = BigNumber.from(txRequest.maxFeePerGas);
const maxPriorityFeePerGas = BigNumber.from(txRequest.maxPriorityFeePerGas);

const formattedTxRequest = {
  value: hexlify(BigNumber.from(txRequest.value)),
  data: txRequest.data,
  nonce,
  gasLimit: BigNumber.from(txRequest.gasLimit),
  gasPrice: maxFeePerGas.add(maxPriorityFeePerGas),
  chainId: 8453,
};

try {
  const signedTransaction = await account.signTransaction(formattedTxRequest);
  const txResponse = await provider.sendTransaction(signedTransaction);
  console.log("Transaction sent:", txResponse.hash);
} catch (error) {
  console.error("Error sending transaction:", error);
}

*/
