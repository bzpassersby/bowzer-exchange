// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // Fetch contract to deploy
   const Token = await ethers.getContractFactory("Token")
 
 // Deploy contract
 const token= await Token.deploy()
 await token.deployed()
 console.log(`Token Deployed to: ${token.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.then(()=> process.exit(0))
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});