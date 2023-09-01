import axios from "axios";
require("dotenv").config();
const dodoAPI = "https://api.dodoex.io/route-service/developer/getdodoroute";
const DODO_API_KEY = process.env.DODO_API_KEY as string;

const dodoSwapQuote = () => {
  const fromTokenAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  const toTokenAddress = "0x4988a896b1227218e4a686fde5eabdcabd91571f";
  const fromAmount = 100000000; // 100 USDC

  const params = {
    fromTokenAddress: fromTokenAddress,
    toTokenAddress: toTokenAddress,
    fromAmount: fromAmount,
    slippage: 1,
    userAddr: "0xfA73Aec7c5ABe6582636edb52165bF39566593a7",
    chainId: 1313161554,
    rpc: "https://aurora-mainnet.infura.io/v3/8e17e3c3e69e4c3cb5c44e822ea99602",
    apikey: DODO_API_KEY,
  };

  axios.get(dodoAPI, { params }).then((response) => {
    console.log(response.data);
  });
};

dodoSwapQuote();
