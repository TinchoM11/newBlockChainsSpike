// @ts-nocheck
import axios from "axios";
import { BigNumber, ethers } from "ethers";
require("dotenv").config();

const CoinMarketCapApiKey = process.env.COIN_MARKET_CAP_API_KEY;

export async function getPrice(symbol: string) {
  // Get CoinMarketCap Token ID by Symbol
  const id = await getCoinMarketCapTokenId(symbol);

  const URL = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${id}`;

  // Get Token Price by CoinMarketCapID
  try {
    const tokenData = await axios.get(URL, {
      headers: {
        "X-CMC_PRO_API_KEY": CoinMarketCapApiKey as string,
      },
    });
    const firstElement = Object.values(tokenData.data.data)[0];
    return firstElement.quote.USD.price;
  } catch (error) {}
}

async function getCoinMarketCapTokenId(symbol: string) {
  const URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map";

  try {
    const tokenData = await axios.get(URL, {
      headers: {
        "X-CMC_PRO_API_KEY": CoinMarketCapApiKey as string,
      },
    });
    const tokenId = tokenData.data.data.find(
      (token: any) => token.symbol === symbol
    ).id;
    return tokenId;
  } catch (error) {}
}

export const numberToBigNumber = (value: string | number, decimals: number) => {
  if (typeof value === "number") {
    return ethers.utils.parseUnits(value.toFixed(decimals), decimals);
  } else return ethers.utils.parseUnits(value, decimals);
};

//getPrice("USDC");
