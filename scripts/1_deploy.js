// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');

async function main() {
  // Fetch contract to deploy
   console.log(`Preparing deployment...\n`)
   const Token = await ethers.getContractFactory('Token')
   const Exchange=await ethers.getContractFactory('Exchange')

 // Get signers
   const accounts=await ethers.getSigners()

   console.log(`Accounts fetched: \n ${accounts[0].address} \n ${accounts[1].address}\n`)


 // Deploy contract
 const bowzer=await Token.deploy('Bowzer Coin','BOWZER','1000000')
 await bowzer.deployed()
 console.log(`BOWZER deployed to: ${bowzer.address}`)

 const mETH=await Token.deploy('mETH','mETH','1000000')
 await mETH.deployed()
 console.log(`mETH deployed to: ${mETH.address}`)

 const mDAI=await Token.deploy('mDAI','mDAI','1000000')
 await mDAI.deployed()
 console.log(`mDAI deployed to: ${mDAI.address}`)

 const exchange=await Exchange.deploy(accounts[1].address,10)
 await exchange.deployed()
 console.log(`Exchange Deployed to: ${exchange.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
.then(()=> process.exit(0))
.catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
