require("dotenv").config();
const { ethers } = require("ethers");

const routerAbi = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable returns (uint[] memory)"
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const router = new ethers.Contract(process.env.ROUTER_ADDRESS, routerAbi, wallet);

async function main() {
  const tokenOut = process.env.TOKEN_OUT; // e.g., USDC or WETH address
  const amountIn = ethers.parseEther("0.01"); // ETH you're swapping
  const amountOutMin = 0; // set minimum amount you accept (or use a real value via price oracle or slippage logic)
  const path = [ethers.ZeroAddress, tokenOut]; // ETH -> token
  const to = await wallet.getAddress();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

  const tx = await router.swapExactETHForTokens(
    amountOutMin,
    path,
    to,
    deadline,
    { value: amountIn }
  );

  console.log("Swap TX hash:", tx.hash);
  await tx.wait();
  console.log("Swap confirmed!");
}

main().catch(console.error);
