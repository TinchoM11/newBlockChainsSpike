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

  const address = "0xb93Bad01CE69496ACB82870e18cf706d7cc6675C";
  const url = `https://api.covalenthq.com/v1/bsc-mainnet/address/${address}/balances_v2/`;

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
