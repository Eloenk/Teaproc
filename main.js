const swapSet = require('./src/yelp');
const main = require('./src/sender');
const { randomInt } = require('crypto');


async function run() {
  try {
    
    console.log("🚀 Starting swap cycles...");
    await swapSet();
    
    
    console.log("🚀 Starting batch sends...");
    await main();

   
    const selectedHours = randomInt(20, 30); 
    const delay = selectedHours * 3600000; 
    console.log(`⏳ Waiting ${selectedHours} hours (${delay / 3600000} hours) until next run...`);
    await new Promise(resolve => setTimeout(resolve, delay));
  } catch (err) {
    console.error("Error during execution:", err);
  }
}


run().catch(console.error);
