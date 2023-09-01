// @ts-nocheck
import axios from "axios";
import { BigNumber } from "ethers";
require("dotenv").config();
const API_KEY = process.env.COVALENT_API_KEY;

async function covalentGetERC20Balances(address: string) {
  let tokenBalances: [
    address: string,
    tokenAddress: string,
    amount: BigNumber
  ] = [];
  const config = {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  const COVALENT_ENDPOINT = `https://api.covalenthq.com/v1/base-mainnet/address/${address}/balances_v2/`;

  try {
    const res = await axios.get(COVALENT_ENDPOINT, config);
    const tokens = res.data.data.items;
    tokens.map((token: any) => {
      if (token.supports_erc && token.supports_erc[0] === "erc20") {
        tokenBalances.push([
          address,
          token.contract_address,
          BigNumber.from(token.balance),
        ]);
      }
    });
    console.log(tokenBalances);
  } catch (error) {
    console.log("Error:", error);
  }
}

async function covalentGetNFTBalances(address: string) {
  let nftBalances: [
    address: string | undefined,
    img: string | undefined,
    name: string | undefined,
    tokenType: string
  ] = [];

  const options = {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  const queryParams = "no-spam=true&with-uncached=true";
  const url = `https://api.covalenthq.com/v1/base-mainnet/address/${address}/balances_nft/?${queryParams}`;
  try {
    const res = await axios.get(url, options);
    const totalNftTokens = res.data.data.items;
    totalNftTokens.map((token: any) => {
      const nftItems = token.nft_data;
      nftItems.forEach((nftItem: any) => {
        if (nftItem.external_data === null) return;
        nftBalances.push({
          address: token.contract_address,
          img: nftItem.external_data.image_512,
          name: nftItem.external_data.name,
          tokenType: "ERC721",
        });
      });
    });
    console.log(nftBalances);
  } catch (error) {
    console.log("Error:", error);
  }
}

covalentGetNFTBalances("0x256DC7A9CDDAc88c9C80AF0445eCEa056d2298dD");
//covalentGetERC20Balances("0xFe0200843C6798CfeE3d174ccF860f8BC1317815");
