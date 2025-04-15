require('dotenv').config();
const fs = require('fs');
const { ethers } = require('ethers');
const { randomInt } = require('crypto');

const abi = [
  "function batchSendEqual(address[] recipients, uint256 amount) external payable",
  "function feePercentage() external view returns (uint256)"
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

function getBatches(addresses, size) {
  const batches = [];
  for (let i = 0; i < addresses.length; i += size) {
    batches.push(addresses.slice(i, i + size));
  }
  return batches;
}

async function main() {
  const data = fs.readFileSync('addr.txt', 'utf8');
  const allAddresses = data.split('\n').map(addr => addr.trim()).filter(Boolean);

  const amountPerRecipient = ethers.parseEther("0.01");
  const feePercentage = await contract.feePercentage();

  const batches = getBatches(allAddresses, 2);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const totalAmount = amountPerRecipient * BigInt(batch.length);
    const fee = (totalAmount * BigInt(feePercentage)) / 10000n;
    const totalValue = totalAmount + fee;

    const tx = await contract.batchSendEqual(batch, amountPerRecipient, { value: totalValue });
    console.log(`Batch ${i + 1} sent:`, tx.hash);
    await tx.wait();
    console.log(`Batch ${i + 1} confirmed`);

    // Random delay between 0.7 and 1.6 minutes using crypto.randomInt
    const randomDelay = randomInt(42 * 1000, 96 * 1000); // Random between 0.7 and 1.6 minutes (42s to 96s)
    console.log(`Waiting for ${randomDelay / 1000} seconds before next send...`);
    await new Promise(resolve => setTimeout(resolve, randomDelay));
  }
}

module.exports = main;
