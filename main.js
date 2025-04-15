const swapSet = require('./src/yelp');
const main = require('./src/sender');
const { randomInt } = require('crypto');

// --- RUN SCRIPT ---
async function run() {
  try {
    // Run swap cycles
    console.log("🚀 Starting swap cycles...");
    await swapSet();
    
    // Run multisender
    console.log("🚀 Starting batch sends...");
    await main();

    // Wait between 20 and 29 hours before next run (in milliseconds)
    const selectedHours = randomInt(20, 30); // Randomly select hours between 20 and 29
    const delay = selectedHours * 3600000; // Convert hours to milliseconds
    console.log(`⏳ Waiting ${selectedHours} hours (${delay / 3600000} hours) until next run...`);
    await new Promise(resolve => setTimeout(resolve, delay));
  } catch (err) {
    console.error("Error during execution:", err);
  }
}

// Start the process
run().catch(console.error);
