require('dotenv').config();
const { ethers } = require('ethers');

const abi = [
  "function batchSendEqual(address[] recipients, uint256 amount) external payable",
  "function multiSend(address[] recipients, uint256[] amounts) external payable",
  "function setFeePercentage(uint256 _feePercentage) external",
  "function withdrawFees() external",
  "function getContractBalance() external view returns (uint256)",
  "function feePercentage() external view returns (uint256)"
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

async function main() {
  const recipients = [
    "0xEFe7C65C7b509DA1427c0B5b420F2673f9BC4949",
  "0x77E163AdbcA819314f2C481EE88253b154803a6D",
  "0x1692835a92EAA6aef93ef289d48851220b5d2F50",
  "0x42F6201e6E99DD5E273B2A09D8551301D55258CF",
  "0xf53c7787a48646d063ab87e164e2435b85692e41"

    ];

  const amountPerRecipient = ethers.parseEther("0.01");
  const totalAmount = amountPerRecipient * BigInt(recipients.length);

  // Dynamically fetch feePercentage (in basis points)
  const feePercentage = await contract.feePercentage(); // e.g., 25 = 0.25%
  const fee = (totalAmount * BigInt(feePercentage)) / 10000n;
  const totalValue = totalAmount + fee;

  const tx = await contract.batchSendEqual(
    recipients,
    amountPerRecipient,
    { value: totalValue }
  );

  console.log("Transaction sent:", tx.hash);
  await tx.wait();
  console.log("Transaction confirmed.");
}

main().catch(console.error);
