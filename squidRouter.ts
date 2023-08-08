import axios from "axios";

async function getRoute() {
  const params = {
    fromChain: 97, // Binance Testnet
    fromToken: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd", // WBNB on Binance Testnet
    fromAmount: "50000000000000000", // 0.05 WBNB
    toChain: 84531, // Base Goerli Testnet
    toToken: "0x4200000000000000000000000000000000000006", // WETH on Base Testnet
    toAddress: "0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688", // the recipient's address
    slippage: 3, // 3 --> 3.00% slippage. SDK supports 2 decimals
    enableForecall: true, // optional, defaults to true
  };

  const result = await axios.get("https://testnet.api.0xsquid.com/v1/route", {
    params: params,
    headers: {
      "x-integrator-id": "your-integrator-id",
    },
  });

  console.log("Route:", result.data);

  // This route returns the Transacion Request that we need to send with the user wallet
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

//getRoute();

const getStatus = async () => {
  const result = await axios.get("https://testnet.api.0xsquid.com/v1/status", {
    params: {
      transactionId:
        "0xc6b6ed43d2e29b36197a1acc711ed14eec735de8525689ab0d216f736f4ba65c",
    },
    headers: {
      "x-integrator-id": "your-integrator-id",
    },
  });
  console.log("Status:", result.data);
};

// The status getter will response a lot of information.
// We need to take the "squidTransactionStatus". When it's 'success' the transaction is done.


//getStatus();
