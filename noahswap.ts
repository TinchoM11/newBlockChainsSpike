require("dotenv").config();
import { ethers } from "ethers";

const EOS_RPC = process.env.EOS_RPC as string;
const EOS_PK = process.env.EOS_PK as string;

export const ERC20_ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function allowance(address owner, address spender) view returns (uint256)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function increaseAllowance(address spender, uint addedValue) returns (bool)",
  "function decreaseAllowance(address spender, uint addedValue) returns (bool)",
  "function approve(address spender, uint addedValue) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

// NoahRouterContract ABI
const contractABI = [
  "function swapExactETHForTokens(uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function WETH() external pure returns (address)",
  "function getAmountsOut(uint256 amountIn, address[] memory path) internal view returns (uint[] memory amounts)",
];

const provider = new ethers.providers.JsonRpcProvider(EOS_RPC);
const contractAddress = "0x1c8f68e8AdBD75c23281e5c88E44D0b7023a4238"; // MAINNET

const noahRouterContract = new ethers.Contract(
  contractAddress,
  contractABI,
  provider
);

async function swapETHForTokens() {
  // Function that will perform the swap

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

//swapETHForTokens();

async function swapTokensForETH() {
  const wallet = new ethers.Wallet(EOS_PK, provider);
  const connectedContract = noahRouterContract.connect(wallet);

  const wethAddress = await connectedContract.WETH(); // get WETH address

  // Params of the function
  const tokenIn = "0xfa9343c3897324496a05fc75abed6bac29f8a40f"; // USDT TOKEN
  const tokenOut = wethAddress; // Wrapped EOS Token on NoahSwap
  const path = [tokenIn, tokenOut];
  const amountIn = 6000000; // 4 USDT
  const deadline = Math.floor(Date.now() / 1000) + 60 * 30; // 30 minutes from the current Unix time
  const to = "0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688";

  // Aprove the contract to spend your USDT
  const usdtContract = new ethers.Contract(tokenIn, ERC20_ABI, provider);
  const usdtContractConnected = usdtContract.connect(wallet);

  // Check Actual Allowance
  const allowance = await usdtContractConnected.allowance(
    wallet.address,
    contractAddress
  );

  if (allowance < amountIn) {
    const txApprove = await usdtContractConnected.approve(
      contractAddress,
      amountIn
    );
    await txApprove.wait();
    console.log("Approve Transaction Hash:", txApprove.hash);
  }

  try {
    // Swap Transaction EOS to TOKEN
    const tx = await connectedContract.swapExactTokensForETH(
      amountIn, // amount of ERC20 tokens to swap
      1, // amountOutMin
      path,
      to, // Where to receive the tokens
      deadline
    );
    console.log("Transaction sent:", tx);
    await tx.wait();
    console.log("Transaction sent:", tx.hash);

    console.log("Successfull swap!");
  } catch (error) {
    console.error("Error while executing the swap:", error);
  }
}

//swapTokensForETH();


// This one not working yet. I thinks its because of liquidity pools
async function swapTokensForTokens() {
  const wallet = new ethers.Wallet(EOS_PK, provider);
  const connectedContract = noahRouterContract.connect(wallet);

  // Params of the function
  const tokenIn = "0xfa9343c3897324496a05fc75abed6bac29f8a40f"; // USDT TOKEN
  const tokenOut = "0xB529283cB363703BD7c049D8Cf157249C2bC32dE"; // USDC TOKEN
  const path = [tokenIn, tokenOut];
  const amountIn = 2000000; // 3 USDT
  const deadline = Math.floor(Date.now() / 1000) + 60 * 30; // 30 minutes from the current Unix time
  const to = "0x035D35aDDdbfce7A80Daf81811a3Cc4C7D6a4688";
  const gasLimit = 210000;

  // Aprove the contract to spend your USDT
  const usdtContract = new ethers.Contract(tokenIn, ERC20_ABI, provider);
  const usdtContractConnected = usdtContract.connect(wallet);

  // Check Actual Allowance
  const allowance = await usdtContractConnected.allowance(
    wallet.address,
    contractAddress
  );
  console.log("Allowance:", allowance);

  if (allowance < amountIn) {
    console.log("Requiere mas approve");
    const txApprove = await usdtContractConnected.approve(
      contractAddress,
      amountIn
    );
    await txApprove.wait();
    console.log("Approve Transaction Hash:", txApprove.hash);
  }

  try {
    // Swap Transaction EOS to TOKEN
    const tx = await connectedContract.swapExactTokensForETH(
      amountIn, // amount of ERC20 tokens to swap
      1, // amountOutMin
      path,
      to, // Where to receive the tokens
      deadline,
      {
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

swapTokensForTokens();
