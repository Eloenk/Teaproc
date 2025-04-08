require('dotenv').config();
const { ethers } = require('ethers');

const abi = [
  "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] calldata path, address to, uint256 deadline) external returns (uint256[] memory amounts)"
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

async function main() {
  // Token details
  const tokenInAddress = process.env.TOKEN_IN; // Address of the input token (e.g., USDT)
  const tokenOutAddress = process.env.TOKEN_OUT; // Address of the output token (e.g., WETH)

  // The path for token swap (e.g., USDT -> WETH)
  const path = [tokenInAddress, tokenOutAddress];

  // Amount of tokens to swap
  const amountIn = ethers.parseUnits("10", 18); // 10 tokens (change decimals accordingly)
  const amountOutMin = ethers.parseUnits("0", 18); // Minimum amount of output tokens (set accordingly)
  // Approve token transfer
  

  // Deadline for the transaction
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

  // Call swap function
  const tx = await contract.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    wallet.address, // Sending tokens to the wallet address
    deadline
  );

  console.log("Transaction sent:", tx.hash);
  await tx.wait();
  console.log("Transaction confirmed.");
}

main().catch(console.error);
