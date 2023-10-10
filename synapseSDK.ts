import { BigNumber, ethers } from "ethers";
import dotenv from "dotenv";
import { SynapseSDK } from "@synapsecns/sdk-router";
dotenv.config();

const PolygonProvider = new ethers.providers.JsonRpcProvider(
  process.env.POLYGON_RPC_MAINNET as string
);

const DFKProvider = new ethers.providers.JsonRpcProvider(
  process.env.DFK_RPC_MAINNET as string
);

const main = async () => {
  const chainIds = [137, 53935];
  const providers = [PolygonProvider, DFKProvider];

  const Synapse = new SynapseSDK(chainIds, providers);

  const deadline = BigNumber.from(Math.floor(Date.now() / 1000) + 60 * 20);

  const quote = await Synapse.bridgeQuote(
    137, // From Chain
    53935, // To Chain
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // From token Address USDC POL
    "0x3AD9DFE640E1A9Cc1D9B0948620820D975c3803a", // To token Address USDC DFK
    BigNumber.from("20000000"), // Amount in
    deadline
  );

  /// This returns the complete Quote object
  console.log(quote);

  // Now we can construct a Transaction Bridge
  const BridgeTx = await Synapse.bridge(
    "0x23eD50dB3e7469695DD30FFD22a7B42716A338FC", // To Address
    quote.routerAddress, // Router Address
    137, // From Chain
    53935, // To Chain
    "0x3AD9DFE640E1A9Cc1D9B0948620820D975c3803a", // To token Address
    BigNumber.from("20000000"), // Amount
    quote.originQuery, // Origin query from bridgeQuote()
    quote.destQuery // Origin query from bridgeQuote()
  );

  console.log(BridgeTx);
  // This returns the "to" address, the "data" of the transaction
};

main();
