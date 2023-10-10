import axios from "axios";

export const getDFKTokenPrice = async (tokenAddress: string) => {
  const API_URL = `https://api.dexscreener.com/latest/dex/tokens/:${tokenAddress}`;
  try {
    const res = await axios.get(API_URL);
    // Return the price but as a number, not string
    console.log(res.data.pairs[0].priceUsd);
    return Number(res.data.pairs[0].priceUsd);
  } catch (error) {
    return null;
  }
};

getDFKTokenPrice("usdc,0xB57B60DeBDB0b8172bb6316a9164bd3C695F133a");
