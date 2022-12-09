const tokens=(n) =>{
	return ethers.utils.parseUnits(n.toString(),'ether')
}

const config= require('../src/config.json')

const wait=(seconds) =>{
	const milliseconds=seconds*1000
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main () {
    //Fetch accounts from wallet
    const accounts=await ethers.getSigners()

    //Fetch network
    const {chainId}=await ethers.provider.getNetwork()
    console.log(`Using ChainId: ${chainId}`)

    //Fetch deployed tokens
    const bowzer=await ethers.getContractAt('Token',config[chainId].bowzer.address)
    console.log(`BOWZER Token fetched: ${bowzer.address}\n`)
    const mETH=await ethers.getContractAt('Token', config[chainId].mETH.address)
    console.log(`mETH Token fetched: ${mETH.address}\n`)
    const mDai=await ethers.getContractAt('Token',config[chainId].mDai.address)
    console.log(`mDai Token fetched: ${mDai.address}\n`)

    //Fetch the deployed exchange
    const exchange=await ethers.getContractAt('Exchange',config[chainId].exchange.address)
    console.log(`Exchange deployed, ${exchange.address}\n`)


	//Distribute tokens
	const sender=accounts[0]
	const receiver=accounts[1]
    let amount=tokens(10000)

    let transaction, result
    transaction=await mETH.connect(sender).transfer(receiver.address,amount)
    reulst=transaction.wait()

    //Set up exchange users
    const user1=accounts[0]
    const user2=accounts[1]
    amount= tokens(10000)

	//Deposit tokens to exchange
    //user1 deposits BOWZER tokens to the exchange
    transaction=await bowzer.connect(user1).approve(exchange.address,amount)
    result=await transaction.wait()
    console.log(`Approved ${amount} tokens from ${user1.address}`)
    transaction=await exchange.connect(user1).depositToken(bowzer.address,amount)
    result=await transaction.wait()
    console.log(`Deposited ${amount} tokens from ${user1.address}`)
    //user2 deposits mETH tokens to exchange
    transaction=await mETH.connect(user2).approve(exchange.address,amount)
    result=await transaction.wait()
    console.log(`Approved ${amount} tokens from ${user2.address}`)
    transaction=await exchange.connect(user2).depositToken(mETH.address,amount)
    result=await transaction.wait()
    console.log(`Deposited ${amount} tokens fom ${user2.address}`)
	
    /////////////////////////
	//Seed a Cancelled Order

	//Make orders
	let orderId
	transaction=await exchange.connect(user1).makeOrder(mETH.address,tokens(5),bowzer.address,tokens(5))
	result=await transaction.wait()
	console.log(`Made order from ${user1.address}`)

	//User 1 cancels order
	orderId=await result.events[0].args.id
	transaction=await exchange.connect(user1).cancelOrder(orderId)
	result=await transaction.wait()
	console.log(`Cancelled order from ${user1.address}\n`)


	// Wait 1 second
	await wait(1)

   /////////////////////////
   //Seed Filled Orders

   // User1 makes order
   transaction=await exchange.connect(user1).makeOrder(mETH.address,tokens(3),bowzer.address,tokens(10))
   result=await transaction.wait()
   console.log(`Made order from ${user1.address}`)

   // User2 fills order
   orderId=result.events[0].args.id 
   transaction=await exchange.connect(user2).fillOrder(orderId)
   result=await transaction.wait()
   console.log(`Filled order from ${user2.address}`)

   //Wait 1 second
   await wait(1)

     
  //User1 makes another order
   transaction=await exchange.connect(user1).makeOrder(mETH.address,tokens(5),bowzer.address,tokens(10))
   result=await transaction.wait()
   console.log(`Made order from ${user1.address}`)

  //User2 filled another order
   orderId=result.events[0].args.id 
   transaction=await exchange.connect(user2).fillOrder(orderId)
   result=await transaction.wait()
   console.log(`Filled order from ${user2.address}`)

  //Wait 1 second
   await wait(1)

  //User1 makes final order
   transaction=await exchange.connect(user1).makeOrder(mETH.address,tokens(18),bowzer.address,tokens(20))
   result=await transaction.wait()
   console.log(`Made order from ${user1.address}`)

  //User2 filled final order
   orderId=result.events[0].args.id 
   transaction=await exchange.connect(user2).fillOrder(orderId)
   result=await transaction.wait()
   console.log(`Filled order from ${user2.address}`)

  //Wait 1 second
  await wait(1)

  /////////////////////////
  //Seed Open Orders

  //User1 makes 10 orders
  for(let i=1;i<=10; i++){
  	transaction=await exchange.connect(user1).makeOrder(mETH.address,tokens(10),bowzer.address,tokens(10*i))
  	result=await transaction.wait()

  	console.log(`Made order from ${user1.address}`)

  	//Wait 1 second
  	await wait(1)
  }
  //User1 makes 10 orders
  for(let i=1;i<=10; i++){
  	transaction=await exchange.connect(user2).makeOrder(bowzer.address,tokens(10),mETH.address,tokens(10*i))
  	result=await transaction.wait()

  	console.log(`Made order from ${user2.address}`)

  	//Wait 1 second
  	await wait(1)
  }
}

main()
.then(()=> process.exit(0))
.catch((error)=> {
	console.error(error)
	process.exit(1)
})