require('dotenv').config();
const { ethers } = require('ethers');
const { randomInt } = require('crypto');

const abi = [
  "function swapNativeForTokens() external payable",
  "function swapTokensForNative(uint256 tokenAmount) external",
  "function balanceOf(address account) view returns (uint256)"
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.DAOV;
const daov = new ethers.Contract(contractAddress, abi, wallet);

// --- UTILS ---
const wait = ms => new Promise(res => setTimeout(res, ms));
const randomMinute = () => randomInt(10_000, 20_000); // Random between 0.7 and 1.6 minutes (42,000ms to 96,000ms)

// --- SWAP SET (50 cycles) ---
async function swapSet() {
  for (let i = 0; i < 150; i++) {
    console.log(`\n🔁 Swap ${i + 1}/50`);

    try {
      const tx1 = await daov.swapNativeForTokens({ value: ethers.parseEther("0.01") });
      await tx1.wait();
      console.log("✅ Swapped Native → DAOV");

      const waitMs = randomMinute();
      console.log(`🕒 Waiting ${(waitMs / 60000).toFixed(1)} minutes before swapping back...`);
      await wait(waitMs);

      const balance = await daov.balanceOf(wallet.address);
      const tx2 = await daov.swapTokensForNative(balance);
      await tx2.wait();
      console.log("✅ Swapped DAOV → Native");
    } catch (err) {
      console.error("❌ Swap error:", err.reason || err.message);
    }
  }
}

module.exports = swapSet;

