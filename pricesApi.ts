// @ts-nocheck
import axios from "axios";
require("dotenv").config();

const CoinMarketCapApiKey = process.env.COIN_MARKET_CAP_API_KEY;
export async function getPrice(symbol: string) {
  // Get CoinMarketCap Token ID by Symbol
  const id = await getCoinMarketCapTokenId(symbol);
  console.log("Token ID", id);

  const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${id}`;

  // Get Token Price by CoinMarketCapID
  try {
    const tokenData = await axios.get(url, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
      },
    });
    const firstElement = Object.values(tokenData.data.data)[0];

    console.log(
      "Symbol:",
      firstElement.symbol,
      "Price:",
      firstElement.quote.USD.price
    );

    return firstElement.quote.USD.price;
  } catch (error) {
    console.log(error);
  }
}

async function getCoinMarketCapTokenId(symbol: string) {
  const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map";

  try {
    const tokenData = await axios.get(url, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
      },
    });
    const tokenId = tokenData.data.data.find(
      (token: any) => token.symbol === symbol
    ).id;
    return tokenId;
  } catch (error) {
    console.log(error);
  }
}
