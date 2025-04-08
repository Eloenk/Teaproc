require("dotenv").config();
const { ethers } = require("ethers");

const routerAbi = [
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory)"
];
const erc20Abi = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)"
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const router = new ethers.Contract(process.env.ROUTER_ADDRESS, routerAbi, wallet);
const token = new ethers.Contract(process.env.TOKEN_IN, erc20Abi, wallet);

async function main() {
  const tokenIn = process.env.TOKEN_IN;
  const amountIn = ethers.parseUnits("10", 18); // adjust decimals
  const amountOutMin = 0; // accept any amount of ETH (for demo; set a real value in production)
  const path = [tokenIn, ethers.ZeroAddress]; // token -> ETH
  const to = await wallet.getAddress();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  // Approve router if needed
  const allowance = await token.allowance(to, router.target);
  if (allowance < amountIn) {
    const approveTx = await token.approve(router.target, amountIn);
    console.log("Approving token...");
    await approveTx.wait();
    console.log("Token approved.");
  }

  // Execute the swap
  const tx = await router.swapExactTokensForETH(
    amountIn,
    amountOutMin,
    path,
    to,
    deadline
  );

  console.log("Swap TX hash:", tx.hash);
  await tx.wait();
  console.log("Swap confirmed!");
}

main().catch(console.error);
