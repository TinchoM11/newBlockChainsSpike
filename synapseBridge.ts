import axios from "axios";

const BASE_URL = "https://synapse-rest-api-v2.herokuapp.com";

interface QuoteParams {
  fromChain: number;
  toChain: number;
  fromToken: string;
  toToken: string;
  amount: number;
  destAddress?: string;
  deadline?: number;
}

// GET /bridge
// Used for getting a quote for bridging tokens between chains.

export const getSynapseQuote = async (quoteParams: QuoteParams) => {
  const url = `${BASE_URL}/bridge`;
  const params = {
    fromChain: quoteParams.fromChain,
    toChain: quoteParams.toChain,
    fromToken: quoteParams.fromToken,
    toToken: quoteParams.toToken,
    amount: quoteParams.amount,
  };

  try {
    const res = await axios.get(url, { params });

    console.log(
      `Getting quote for bridging ${params.fromToken} from ${params.fromChain} to ${params.toChain}`
    );
    console.log("Response: ", res.data);

    return res.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// EXAMPLE USAGE
getSynapseQuote({
  fromChain: 137,
  toChain: 53935,
  fromToken: "USDC",
  toToken: "USDC",
  amount: 2000000,
  destAddress: "0xcc78d2f004c9de9694ff6a9bbdee4793d30f3842",
});

// Returns:
// feeAmount (object) - The fee amount for the swap/bridge. Contains:
// type (string) - Data type
// hex (string) - Fee amount encoded in hex
// feeConfig (array) - Fee configuration parameters, contains:
// 0 (number) - Gas price
// 1 (object) - Fee percentage denominator (hex encoded BigNumber)
// 2 (object) - Protocol fee percentoriginQueryage numerator (hex encoded BigNumber)
// routerAddress (string) - Address of the router contract
// maxAmountOut (object) - Maximum amount receivable from swap/bridge, structure same as above
//  (object) - Original swap query/bridge parameters, contains:
// swapAdapter (string) - Swap adapter address
// tokenOut (string) - Address of output token
// minAmountOut (object) - Minimum output token amount
// deadline (object) - Expiry time
// rawParams (string) - Encoded hex params
// destQuery (object) - Destination swap query parameters, structure similar to originQuery above.
// maxAmountOutStr (string) - maxAmountOut as a decimal string

// ****************************************
// ****************************************
// GET /bridgeTxInfo - Used for getting the transaction info for a bridge transaction.
// /bridgeTxInfo?fromChain=1&toChain=42161&fromToken=USDC&toToken=USDC&amount=1000000&destAddress=0xcc78d2f004c9de9694ff6a9bbdee4793d30f3842

// EXAMPLE USAGE
export const getBridgeSynapseTxInfo = async (quoteParams: QuoteParams) => {
  const url = `${BASE_URL}/bridgeTxInfo`;
  const params = {
    fromChain: quoteParams.fromChain,
    toChain: quoteParams.toChain,
    fromToken: quoteParams.fromToken,
    toToken: quoteParams.toToken,
    amount: quoteParams.amount,
    destAddress: quoteParams.destAddress,
    deadline: quoteParams.deadline,
  };

  try {
    const res = await axios.get(url, { params });

    console.log(
      `Getting tx info for bridging ${params.fromToken} from ${params.fromChain} to ${params.toChain}`
    );
    console.log("Response: ", res.data);

    return res.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Actual Date + 2 horus in Epoch Time
const deadline = Math.floor(Date.now() / 1000) + 60 * 60 * 2;

// getBridgeSynapseTxInfo({
//   fromChain: 43114,
//   toChain: 53935,
//   fromToken: "USDC",
//   toToken: "USDC",
//   amount: 10000000,
//   destAddress: "0xcc78d2f004c9de9694ff6a9bbdee4793d30f3842",
//   deadline,
// });

// Returns:
// data: The binary data that forms the input to the transaction.
// to: The address of the Synapse Router (the synapse bridge contract)

// ****************************************
// ****************************************
// SWAPS WITHIN A CHAIN USING SYNAPSE
// GET /swap
// Used for getting a quote for swapping tokens within a chain.
// /swap?chain=1&fromToken=USDC&toToken=DAI&amount=100

export const getSwapQuoteSynapse = async (quoteParams: {
  chain: number;
  fromToken: string;
  toToken: string;
  amount: number;
}) => {
  const url = `${BASE_URL}/swap`;

  const params = {
    chain: quoteParams.chain,
    fromToken: quoteParams.fromToken,
    toToken: quoteParams.toToken,
    amount: quoteParams.amount,
  };

  try {
    const res = await axios.get(url, { params });

    console.log(
      `Getting quote for swapping ${params.fromToken} to ${params.toToken} on chain ${params.chain}`
    );
    console.log("Response: ", res.data);

    return res.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// EXAMPLE USAGE
// getSwapQuoteSynapse({
//   chain: 137,
//   fromToken: "USDC",
//   toToken: "DAI",
//   amount: 10000000,
// });

// Get Swap Tx Info
export const getSwapTxInfoSynapse = async (quoteParams: {
  chain: number;
  fromToken: string;
  toToken: string;
  amount: number;
}) => {
  const url = `${BASE_URL}/swapTxInfo`;

  const params = {
    chain: quoteParams.chain,
    fromToken: quoteParams.fromToken,
    toToken: quoteParams.toToken,
    amount: quoteParams.amount,
  };

  try {
    const res = await axios.get(url, { params });

    console.log(
      `Getting Tx Info for swapping ${params.fromToken} to ${params.toToken} on chain ${params.chain}`
    );
    console.log("Response: ", res.data);

    return res.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// EXAMPLE USAGE
// getSwapTxInfoSynapse({
//   chain: 53935,
//   fromToken: "AVAX",
//   toToken: "JEWEL",
//   amount: 100000000,
// });

// Returns:
// data: The binary data that forms the input to the transaction.
// to: The address of the Synapse Router (the synapse bridge contract)
