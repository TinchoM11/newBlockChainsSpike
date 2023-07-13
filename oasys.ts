import { BigNumber } from "ethers";

const axios = require("axios");

const BASE_URL = "https://scan.oasys.games/api";
const address = "0xB6e607Fb81223C87DbCA06451594202A82C4D6eA";
const address2 = "0x9245e19eB88de2534E03E764FB2a5f194e6d97AD";
const tokenContractAddress = "0x086672985bedaf351adf3db01dace676fc5d2f93";
const txHashExample =
  "0x3802ea9db3489254ea9697c9f8e3c6e0f2958568f793e162a531b6fe4ab496ce";

async function main() {
  //  GET NATIVE BALANCE
  const url = `${BASE_URL}?module=account&action=eth_get_balance&address=${address}`;

  try {
    const response = await axios.get(url);
    const balance = response.data.result;
    console.log("Native Balance:", BigNumber.from(balance).toString());
  } catch (error) {
    console.error("Error:", error);
  }

  // OTHER OPTION FOR GETTING BALANCE
  console.log("Other Option For Getting Balance:");
  const url2 = `${BASE_URL}?module=account&action=balance&address=${address}`;
  try {
    const response = await axios.get(url2);
    const balance = response.data.result;
    console.log("Native Balance:", BigNumber.from(balance).toString());
  } catch (error) {
    console.error("Error:", error);
  }

  // PENDING TRANSACTIONS
  console.log("Pending Transactions:");
  const url3 = `${BASE_URL}?module=account&action=pendingtxlist&address=${address}`;
  try {
    const response = await axios.get(url3);
    const pendingTx = response.data.result;
    console.log("Pending Tx:", pendingTx);
  } catch (error) {
    console.error("Error:", error);
  }

  // 10 days before now
  const actualTimestamp = Math.floor(Date.now() / 1000);
  const tenDays = 864000;
  const startTimestamp = actualTimestamp - tenDays;

  // LIST OF TRANSACTIONS
  console.log("List of Transactions of last X days:");
  const url4 = `${BASE_URL}?module=account&action=txlist&address=${address}&starttimestamp=${startTimestamp}`;
  try {
    const response = await axios.get(url4);
    const txList = response.data.result;
    console.log("Tx List:", txList);
  } catch (error) {
    console.error("Error:", error);
  }

  // GET TRANSACTIONS BY HASH
  console.log("Get Transactions By Hash:");
  const url5 = `${BASE_URL}?module=account&action=txlistinternal&txhash=${txHashExample}`;
  try {
    const response = await axios.get(url5);
    const txList = response.data;
    console.log("Tx List:", txList);
  } catch (error) {
    console.error("Error:", error);
  }

  // GET TRANSACTIONS RECEIPT STATUS
  console.log("Get Transactions Receipt Status:");
  const url9 = `${BASE_URL}?module=transaction&action=gettxreceiptstatus&txhash=${txHashExample}`;
  try {
    const response = await axios.get(url9);
    const txList = response.data;
    console.log("Tx Status:", txList);
  } catch (error) {
    console.error("Error:", error);
  }

  // GET LIST OF TOKENS OWNED BY ADDRESS
  console.log("Get List of Tokens Owned By Address:");
  const url6 = `${BASE_URL}?module=account&action=tokenlist&address=${address2}`;
  try {
    const response = await axios.get(url6);
    const tokenList = response.data.result;
    console.log("Token List:", tokenList);
  } catch (error) {
    console.error("Error:", error);
  }

  // GET TOKEN INFORMATION
  console.log("--------------------");
  console.log("Get Token Information:");

  const url7 = `${BASE_URL}?module=token&action=getToken&contractaddress=${tokenContractAddress}`;
  try {
    const response = await axios.get(url7);
    const tokenInfo = response.data.result;
    console.log("Token Info:", tokenInfo);
  } catch (error) {
    console.error("Error:", error);
  }

  // GET NATIVE TOKEN PRICE IN USD OR BTC
  console.log("--------------------");
  console.log("Get Native Token Price in USD or BTC:");

  const url8 = `${BASE_URL}?module=stats&action=coinprice`;
  try {
    const response = await axios.get(url8);
    const tokenPrice = response.data.result;
    console.log("Token Price:", tokenPrice);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
