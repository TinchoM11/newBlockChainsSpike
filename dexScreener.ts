import axios from "axios";

export const getDFKTokenPrice = async (tokenAddress: string) => {
  const API_URL = `https://api.dexscreener.com/latest/dex/tokens/:${tokenAddress}`;
  try {
    const res = await axios.get(API_URL);
    // Return the price but as a number, not string
    return Number(res.data.pairs[0].priceUsd);
  } catch (error) {
    return null;
  }
};

//getDFKTokenPrice("usdc,0xCd2192521BD8e33559b0CA24f3260fE6A26C28e4");
