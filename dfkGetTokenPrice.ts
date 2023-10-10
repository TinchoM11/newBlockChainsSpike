import { BigNumber, ethers } from "ethers";
import { covalentGetERC20Balances, covalentGetNFTBalances } from "./covalentHq";
import { getPriceFromCoinMarketCap } from "./coinMarketCap";
import dotenv from "dotenv";
dotenv.config();

const DFK_RPC = process.env.DFK_RPC_MAINNET as string;
const provider = new ethers.providers.JsonRpcProvider(DFK_RPC);

const uniswapRouterAddress = "0x3C351E1afdd1b1BC44e931E12D4E05D6125eaeCa";

const tokenAAddress = "0x240da5314B05E84392e868aC8f2b80ad6becadd4";
const tokenBAddress = "0xCCb93dABD71c8Dad03Fc4CE5559dC3D89F67a260"; // WJewel

const uniswapRouter = new ethers.Contract(
  uniswapRouterAddress,
  ["function getAmountsOut(uint256, address[]) view returns (uint256[])"],
  provider
);

const ERC20_ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

const tokenAContract = new ethers.Contract(tokenAAddress, ERC20_ABI, provider);
const tokenBContract = new ethers.Contract(tokenBAddress, ERC20_ABI, provider);

async function getPrice() {
  try {
    const tokenASymbol = await tokenAContract.symbol();
    const tokenBSymbol = await tokenBContract.symbol();
    const tokenADecimals = await tokenAContract.decimals();
    const tokenBDecimals = await tokenBContract.decimals();

    console.log("Token A Symbol:", tokenASymbol);
    console.log("Token B Symbol:", tokenBSymbol);
    console.log("Token A Decimals:", tokenADecimals.toString());
    console.log("Token B Decimals:", tokenBDecimals.toString());

    const amount = "10";
    const amountIn = ethers.utils.parseUnits(amount, tokenADecimals);
    const path = [tokenAAddress, tokenBAddress];

    const amounts = await uniswapRouter.getAmountsOut(amountIn, path);
    console.log("AMounts", JSON.stringify(amounts, null, 2));
    // El precio estará en amounts[1], ya que estás obteniendo el precio de tokenA a tokenB
    const priceTokenAtoB = amounts[1]
      .div(BigNumber.from(10).pow(tokenBDecimals))
      .toString();

    console.log(
      `The price of ${amount} ${tokenASymbol} a ${tokenBSymbol} es: ${priceTokenAtoB}`
    );

    const jewelPrice = await getPriceFromCoinMarketCap("JEWEL");

    console.log("Jewel Price:", jewelPrice);

    console.log(
      `Token ${tokenASymbol} price in USD: ${priceTokenAtoB * jewelPrice}`
    );
  } catch (error) {
    console.error("Error al obtener el precio:", error);
  }
}

// Llama a la función para obtener el precio
getPrice();
