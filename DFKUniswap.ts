import { BigNumber, ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

/// FUNCTION TO MAKE A SWAP USING UNISWAPV2 ROUTER ON DFK CHAIN
const DFK_RPC = process.env.DFK_RPC_MAINNET as string;
const provider = new ethers.providers.JsonRpcProvider(DFK_RPC);

const uniswapRouterAddress = "0x3C351E1afdd1b1BC44e931E12D4E05D6125eaeCa";

const avaxAddress = "0xB57B60DeBDB0b8172bb6316a9164bd3C695F133a";
const usdcAddress = "0x3AD9DFE640E1A9Cc1D9B0948620820D975c3803a";
const jewelAddress = "0xCCb93dABD71c8Dad03Fc4CE5559dC3D89F67a260"; // WJewel

const routerContract = new ethers.Contract(
  uniswapRouterAddress,
  [
    "function getAmountsOut(uint256, address[]) view returns (uint256[])",
    "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint deadline)",
  ],
  provider
);

const ERC20_ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

// Function to get the amount of JEWEL you would get if you swap X quantity of AVAX
async function getAmountOut() {
  const fromTokenContract = new ethers.Contract(
    usdcAddress,
    ERC20_ABI,
    provider
  );
  const fromTokenSymbol = await fromTokenContract.symbol();
  const fromTokenDecimals = await fromTokenContract.decimals();
  const amountIn = ethers.utils.parseUnits("1", fromTokenDecimals); // 10 USDC/AVAX or whatever

  const path = [usdcAddress, jewelAddress]; // Ruta de intercambio: AVAX-> JEWEL
  try {
    const amounts = await routerContract.getAmountsOut(amountIn, path);

    if (amounts && amounts.length >= 2) {
      const jewelAmount = ethers.utils.formatEther(amounts[1]); // Cantidad de JEWEL en Ether
      console.log(
        `You will get ${jewelAmount} JEWEL swapping ${amountIn} ${fromTokenSymbol} for JEWEL.`
      );
      return ethers.utils.parseUnits(jewelAmount, 18);
    }
  } catch (error) {
    console.error("Error while getting swap information", error);
    throw error;
  }

  return BigNumber.from(0);
}

//getAmountOut();

async function swapTokens() {
  const fromTokenContract = new ethers.Contract(
    usdcAddress,
    ERC20_ABI,
    provider
  );
  const fromTokenSymbol = await fromTokenContract.symbol();
  const fromTokenDecimals = await fromTokenContract.decimals();

  const privateKey = process.env.PK as string;
  const wallet = new ethers.Wallet(privateKey, provider);
  const uniswapRouter = new ethers.Contract(
    uniswapRouterAddress,
    [
      "function getAmountsOut(uint256, address[]) view returns (uint256[])",
      "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint deadline)",
    ],
    wallet
  );

  const amountIn = ethers.utils.parseUnits("1", fromTokenDecimals); // 10 USDC/AVAX or whatever
  const amountOut = await getAmountOut();
  console.log("amountOut", amountOut);
  const amountOutMin = amountOut.mul(98).div(100); // 2% slippage
  const path = [usdcAddress, jewelAddress]; // AVAX -> JEWEL
  const to = "0x23eD50dB3e7469695DD30FFD22a7B42716A338FC"; // Address to send the swapped tokens
  const deadline = Math.floor(Date.now() / 1000) + 60 * 30; // 30 min from now

  try {
    const tx = await uniswapRouter.swapExactTokensForTokens(
      amountIn,
      amountOutMin,
      path,
      to,
      deadline,
      { gasLimit: 300000 }
    );

    // Esperar a que la transacción se confirme en la cadena
    const receipt = await tx.wait();
    console.log(`Transacción exitosa. TxHash: ${receipt.transactionHash}`);
  } catch (error) {
    console.error("Error al realizar el swap:", error);
  }
}

swapTokens();
