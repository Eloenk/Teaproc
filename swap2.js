require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractAddress = "0xE15efbaA098AA81BaB70c471FeA760684dc776ae";

const abi = [
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline) external"
];

const contract = new ethers.Contract(contractAddress, abi, wallet);

async function swap() {
  const amountIn = ethers.parseUnits("30", 18);
  const amountOutMin = ethers.parseUnits("0", 18);
  const path = [process.env.TOKEN_IN, process.env.TOKEN_OUT];
  const to = wallet.address;
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  try {
    const tx = await contract.swapExactTokensForTokens(amountIn, amountOutMin, path, to, deadline);
    console.log("Tx sent:", tx.hash);
    await tx.wait();
    console.log("Swap confirmed!");
  } catch (err) {
    console.error("Swap failed:", err);
  }
}

swap();
