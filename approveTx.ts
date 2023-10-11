import { BigNumber, Contract, ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

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

export const checkAndSetAllowance = async (
  tokenAddress: string,
  approvalAddress: string
) => {
  const DFK_RPC = process.env.DFK_RPC_MAINNET as string;
  const provider = new ethers.providers.JsonRpcProvider(DFK_RPC);
  const DFK_PK = process.env.DFK_PK as string;
  const wallet = new ethers.Wallet(DFK_PK, provider);

  const erc20 = new Contract(tokenAddress, ERC20_ABI, wallet);

  const allowance = await erc20.allowance(
    await wallet.getAddress(),
    approvalAddress
  );

  if (allowance.gt(ethers.constants.Zero)) return;

  const estimatedGas = await erc20.estimateGas.approve(
    approvalAddress,
    ethers.constants.MaxUint256
  );
  console.log(`Estimated gas: ${estimatedGas.toString()}`);
  console.log(`Estimated gas limit: ${estimatedGas.mul(110).div(100)}`);
  const approvalGas = estimatedGas.mul(110).div(100); // increase in 10% the gas limit
  const gasPrice = await wallet.getGasPrice();
  const approveTx = await erc20.approve(
    approvalAddress,
    ethers.constants.MaxUint256,
    { gasLimit: 300000 }
  );

  const receipt = await approveTx.wait();
  console.log(`Approve Tx. TxHash: ${receipt.transactionHash}`);
};

// checkAndSetAllowance(
//   "0xCCb93dABD71c8Dad03Fc4CE5559dC3D89F67a260", // TOKEN ADDRESS
//   "0x3C351E1afdd1b1BC44e931E12D4E05D6125eaeCa" // UNISWAP ROUTER ON DFK
// );
