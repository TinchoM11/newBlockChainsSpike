// @ts-nocheck
import axios from "axios";
require("dotenv").config();

async function getBalances() {
  const API_KEY = process.env.COVALENT_API_KEY;

  const config = {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  const address = "0x80C67432656d59144cEFf962E8fAF8926599bCF8";
  const url = `https://api.covalenthq.com/v1/base-mainnet/address/${address}/balances_v2/`;

  const balance = await axios
    .get(url, config)
    .then((response) => {
      console.log("Balance of Address", address);
      console.log(response.data.data.items);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

getBalances();
