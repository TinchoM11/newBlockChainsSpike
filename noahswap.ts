require("dotenv").config();
import { ethers } from "ethers";

const EOS_RPC = process.env.EOS_RPC as string;
const EOS_PK = process.env.EOS_PK as string;

// NoahRouterContract ABI
const contractABI = [
  "function swapExactETHForTokens(uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external payable returns (uint[] memory amounts)",
  "function WETH() external pure returns (address)",
  "function getAmountsOut(uint256 amountIn, address[] memory path) internal view returns (uint[] memory amounts)",
];

// Function that will perform the swap
async function swapETHForTokens() {
  const provider = new ethers.providers.JsonRpcProvider(EOS_RPC);
  const contractAddress = "0x1c8f68e8AdBD75c23281e5c88E44D0b7023a4238"; // MAINNET
  const noahRouterContract = new ethers.Contract(
    contractAddress,
    contractABI,
    provider
  );

  const wallet = new ethers.Wallet(EOS_PK, provider);
  const connectedContract = noahRouterContract.connect(wallet);

  const wethAddress = await connectedContract.WETH(); // get WETH address

  // Params of the function
  const tokenIn = wethAddress; // Wrapped EOS Token on NoahSwap
  const tokenOut = "0xfa9343c3897324496a05fc75abed6bac29f8a40f"; // USDT TOKEN
  const path = [tokenIn, tokenOut];
  const gasLimit = 210000;
  const value = ethers.utils.parseEther("2"); // Amount of EOS to swap
  const deadline = Math.floor(Date.now() / 1000) + 60 * 30; // 30 minutes from the current Unix time
  const to = "0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688";

  try {
    // Swap Transaction EOS to TOKEN
    const tx = await connectedContract.swapExactETHForTokens(
      1, // amountOutMin
      path,
      to, // Where to receive the tokens
      deadline,
      {
        value, // Amount of EOS to swap
        gasLimit,
      }
    );
    console.log("Transaction sent:", tx);
    await tx.wait();
    console.log("Transaction sent:", tx.hash);

    console.log("Successfull swap!");
  } catch (error) {
    console.error("Error while executing the swap:", error);
  }
}

swapETHForTokens();
