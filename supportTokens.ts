/**
 * We should see if there is a way to get this information without storing it in the database.
 * Maybe we store it in the file? Odos notes that they support tokens not listed in here but can't garuntee a route
 */
import "dotenv/config";
import * as admin from "firebase-admin";
import serviceAccount from "../utils/serviceAccount";
import axios from "axios";
import { TOKEN_LIST_URL } from "@jup-ag/core";
import { idToSupportedChains, SupportedChains } from "../utils/supportedChains";
import { Token } from "../utils/supportedTokens";
import { apiImmutable } from "../utils/connections/immutable";
interface RawToken {
  symbol: string;
  name: string;
  decimals: number;
  token_address: string;
  image_url: string;
  chain_id: SupportedChains;
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
admin.firestore().settings({ ignoreUndefinedProperties: true });
// Add custom tokens
const ETH_CUSTOM: Token[] = [
  // TODO: Wormhole USDC
  // {
  //   address: "0x576Cf361711cd940CD9C397BB98C4C896cBd38De",
  //   chain: SupportedChains.ETHEREUM,
  //   symbol: "USDC",
  //   name: "USD Coin (Wormhole) (USDC)",
  //   decimals: 6,
  //   logoURI:
  //     "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
  // },
];
const POLY_CUSTOM: Token[] = [
  {
    address: "0x576Cf361711cd940CD9C397BB98C4C896cBd38De",
    chain: SupportedChains.POLYGON,
    symbol: "USDC",
    name: "USD Coin (Wormhole) (USDC)",
    decimals: 6,
    logoURI:
      "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
  },
];
const AVA_CUSTOM: Token[] = [
  {
    address: "0x0950Fc1AD509358dAeaD5eB8020a3c7d8b43b9DA",
    chain: SupportedChains.AVALANCHE,
    symbol: "USDC",
    name: "USD Coin (Wormhole) (USDC)",
    decimals: 6,
    logoURI:
      "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
  },
];
const BSC_CUSTOM: Token[] = [
  {
    address: "0x672147dD47674757C457eB155BAA382cc10705Dd",
    chain: SupportedChains.BINANCE,
    symbol: "USDCpo",
    name: "USD Coin (POS)(Wormhole) (USDC)",
    decimals: 6,
    logoURI:
      "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
  },
  {
    address: "0x91Ca579B0D47E5cfD5D0862c21D5659d39C8eCf0",
    chain: SupportedChains.BINANCE,
    symbol: "USDCso",
    name: "USD Coin (Wormhole) (USDC)",
    decimals: 6,
    logoURI:
      "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
  },
];
const FTM_CUSTOM: Token[] = [
  {
    address: "0xEfE7701cb2B80664385Be226d0300912CA92f66A",
    chain: SupportedChains.FANTOM,
    symbol: "USDC",
    name: "USD Coin (Wormhole) (USDC)",
    decimals: 6,
    logoURI:
      "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
  },
];
const SOL_CUSTOM: Token[] = [
  {
    address: "E2VmbootbVCBkMNNxKQgCLMS1X3NoGMaYAsufaAsf7M",
    chain: SupportedChains.SOLANA,
    symbol: "USDC",
    name: "USD Coin (PoS) (Wormhole) (USDC)",
    decimals: 6,
    logoURI:
      "https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
  },
];

// Token addresses blacklist
const ETH_BLACK_LIST: string[] = [];
const POLY_BLACK_LIST: string[] = [];
const AVA_BLACK_LIST: string[] = [];
const BSC_BLACK_LIST: string[] = [];
const FTM_BLACK_LIST: string[] = [];
const SOL_BLACK_LIST: string[] = [];
const OPT_BLACK_LIST: string[] = [];
const ARB_BLACK_LIST: string[] = [];
const IMX_BLACK_LIST: string[] = [];
const GNO_BLACK_LIST: string[] = [];
const EOSEMV_BLACK_LIST: string[] = [];
// Fetch odos tokens
export const odosGetTokensList = async (chainId: number) => {
  // Odos doesn't provide images so we use 1inch data
  const imagesSource = await inchGetTokenList(chainId);
  const source = `https://api.odos.xyz/info/tokens/${chainId}`;
  const res = await axios.get(source);
  const tokens: Token[] = [];
  for (const [address, token] of Object.entries(res.data.tokenMap)) {
    const { symbol, name, decimals } = token as any;
    let logoURI = "";
    if (symbol == "ETH") {
      logoURI =
        "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png";
    } else if (symbol == "MATIC") {
      logoURI =
        "https://tokens.1inch.io/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png";
    } else if (symbol == "AVAX") {
      logoURI =
        "https://tokens.1inch.io/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7.png";
    } else if (symbol == "BNB") {
      logoURI =
        "https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c_1.png";
    } else if (symbol == "FTM") {
      logoURI =
        "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png";
    } else {
      logoURI =
        imagesSource.find(
          (t) => t.address.toLowerCase() === address.toLowerCase()
        )?.logoURI ?? "";
    }

    tokens.push({
      chain: idToSupportedChains[chainId],
      symbol,
      name,
      decimals,
      address,
      logoURI,
    });
  }
  return tokens;
};
// TODO: Create supported networks and tokens cache
// Fetch 1inch tokens
export const inchGetTokenList = async (chainId: number) => {
  const source = `https://api.1inch.io/v5.0/${chainId}/tokens`;
  const res = await axios.get(source);
  const tokens: Token[] = Object.values(res.data.tokens);
  return tokens.map(({ symbol, name, decimals, address, logoURI }) => ({
    symbol,
    name,
    decimals,
    address,
    logoURI,
  }));
};
export const jupGetTokenList = async () => {
  const res = await axios.get(TOKEN_LIST_URL["mainnet-beta"]);
  const tokens: Token[] = res.data;
  return tokens.map(({ symbol, name, decimals, address, logoURI }) => ({
    symbol,
    name,
    decimals,
    address,
    logoURI,
  }));
};
export const getImxTokenList = async () => {
  const res = await axios.get(`${apiImmutable}/tokens`);
  const formatedTokens: Token[] = res.data.result.map((token: RawToken) => {
    if (!token.token_address && token.symbol === "ETH") {
      token.token_address = "0x0000000000000000000000000000000000000000";
    }
    return {
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      address: token.token_address,
      logoURI: token.image_url,
      chain: SupportedChains.IMMUTABLE,
    };
  });
  return formatedTokens;
};

// Right Now we only Support Native Token. We need to know how to fetch all ERC20 tokens data
export const getEosEvmTokenList = () => {
  return [
    {
      symbol: "EOS",
      chain: SupportedChains.EOSEVM,
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      name: "EOS",
      logoURI:
        "https://icons.stealthex.io/coins-color/6277b158de5ae50018e739bc-eos_c.svg",
    },
  ];
};

const main = async () => {
  // EVM
  const ETHEREUM: Token[] = (await odosGetTokensList(1))
    .map((t) => ({
      ...t,
      chain: SupportedChains.ETHEREUM,
    }))
    .filter(
      (t) =>
        !ETH_BLACK_LIST.map((b) => b.toLowerCase()).includes(
          t.address.toLowerCase()
        )
    )
    .concat(ETH_CUSTOM);
  const OPTIMISM: Token[] = (await odosGetTokensList(10))
    .map((t) => ({
      ...t,
      chain: SupportedChains.OPTIMISM,
    }))
    .filter(
      (t) =>
        !OPT_BLACK_LIST.map((b) => b.toLowerCase()).includes(
          t.address.toLowerCase()
        )
    );
  const POLYGON: Token[] = (await odosGetTokensList(137))
    .map((t) => ({
      ...t,
      chain: SupportedChains.POLYGON,
    }))
    .filter(
      (t) =>
        !POLY_BLACK_LIST.map((b) => b.toLowerCase()).includes(
          t.address.toLowerCase()
        )
    )
    .concat(POLY_CUSTOM);
  const AVALANCHE: Token[] = (await odosGetTokensList(43114))
    .map((t) => ({
      ...t,
      chain: SupportedChains.AVALANCHE,
    }))
    .filter(
      (t) =>
        !AVA_BLACK_LIST.map((b) => b.toLowerCase()).includes(
          t.address.toLowerCase()
        )
    )
    .concat(AVA_CUSTOM);
  const IMMUTABLE: Token[] = (await getImxTokenList()).filter(
    (t) =>
      !IMX_BLACK_LIST.map((b) => b.toLowerCase()).includes(
        t.address.toLowerCase()
      )
  );
  const GNOSIS: Token[] = [];
  const BINANCE: Token[] = (await odosGetTokensList(56))
    .map((t) => ({
      ...t,
      chain: SupportedChains.BINANCE,
    }))
    .filter(
      (t) =>
        !BSC_BLACK_LIST.map((b) => b.toLowerCase()).includes(
          t.address.toLowerCase()
        )
    )
    .concat(BSC_CUSTOM);
  const ARBITRUM: Token[] = (await odosGetTokensList(42161))
    .map((t) => ({
      ...t,
      chain: SupportedChains.ARBITRUM,
    }))
    .filter(
      (t) =>
        !ARB_BLACK_LIST.map((b) => b.toLowerCase()).includes(
          t.address.toLowerCase()
        )
    );
  const FANTOM: Token[] = (await odosGetTokensList(250))
    .map((t) => ({
      ...t,
      chain: SupportedChains.FANTOM,
    }))
    .filter(
      (t) =>
        !FTM_BLACK_LIST.map((b) => b.toLowerCase()).includes(
          t.address.toLowerCase()
        )
    )
    .concat(FTM_CUSTOM);
  const SOLANA: Token[] = (await jupGetTokenList())
    .map((t) => ({
      ...t,
      chain: SupportedChains.SOLANA,
    }))
    .filter(
      (t) =>
        !SOL_BLACK_LIST.map((b) => b.toLowerCase()).includes(
          t.address.toLowerCase()
        )
    )
    .concat(SOL_CUSTOM);
  const EOS_EVM: Token[] = getEosEvmTokenList();
  const supportedTokensDoc = {
    ETHEREUM,
    SOLANA,
    POLYGON,
    OPTIMISM,
    AVALANCHE,
    IMMUTABLE,
    BINANCE,
    ARBITRUM,
    FANTOM,
    GNOSIS,
    EOS_EVM,
  };
  // Just an util. Remember to update tokensMetadata.json in mocks
  // fs.writeFile(
  //   "supportedTokens.json",
  //   JSON.stringify(supportedTokensDoc),
  //   (err) => {
  //     if (err) console.log("error", err);
  //   }
  // );
  await admin
    .firestore()
    .collection("config")
    .doc("supported-tokens")
    .set(supportedTokensDoc);
};
main();
