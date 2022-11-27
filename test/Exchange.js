const{ expect }= require('chai');
const{ ethers }=require('hardhat');
const tokens=(n)=>{
	return ethers.utils.parseUnits(n.toString(),'ether')
}

describe('Exchange',()=>{
	
let exchange,deployer,feeAccount, amount
const feePercent = 10

beforeEach(async ()=>{
    accounts = await ethers.getSigners()
    deployer= accounts[0]
    feeAccount= accounts[1]
    user1=accounts[2]
    user2=accounts[3]

    
	const Exchange =await ethers.getContractFactory('Exchange')
    exchange= await Exchange.deploy(feeAccount.address, feePercent)



    const Token1 =await ethers.getContractFactory('Token')
    token1= await Token1.deploy('Bowzer Coin','BOWZER','1000000')

    const Token2 =await ethers.getContractFactory('Token')
    token2= await Token2.deploy('Mock Dai','mDai','1000000')



})

describe('Deployment',()=>{

it('tracks the fee account',async ()=>{
   
	expect(await exchange.feeAccount()).to.equal(feeAccount.address)
})

it('tracks the fee percent',async ()=>{
   
    expect(await exchange.feePercent()).to.equal(feePercent)
})

})

describe('Depositing Tokens', ()=>{
    let transaction, result
    let amount=tokens(100)


   
describe('Success',()=>{

   beforeEach(async ()=>{


    transaction=await token1.connect(user1).approve(exchange.address, amount)
    result=await transaction.wait()

    transaction=await token1.connect(deployer).transfer(user1.address, amount)
    result=await transaction.wait()

    transaction= await exchange.connect(user1).depositToken(token1.address, amount)
    result=await transaction.wait()
    
})

it ('track the token deposit', async ()=>{
    expect(await token1.balanceOf(exchange.address)).to.equal(amount)
    expect(await exchange.tokens(token1.address, user1.address)).to.equal(amount)
    expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(amount)
})

it ('emits a Deposit event', async ()=>{
    const event=result.events[1]
    expect(event.event).to.equal('Deposit')

    const args=event.args
    expect(args.token).to.equal(token1.address)
    expect(args.user).to.equal(user1.address)
    expect(args.amount).to.equal(amount)
    expect(args.balance).to.equal(amount)
})

})

describe('Failure', () =>{
it('fails when no tokens are approved', async()=>{
    await expect(exchange.connect(user1).depositToken(token1.address,amount)).to.be.reverted

})

})

})

describe('Withdrawing Tokens', ()=>{
    let transaction, result
    let amount=tokens(100)


   
describe('Success',()=>{

   beforeEach(async ()=>{
//Deposit tokens before withdrawing
    transaction=await token1.connect(user1).approve(exchange.address, amount)
    result=await transaction.wait()

    transaction=await token1.connect(deployer).transfer(user1.address, amount)
    result=await transaction.wait()

    transaction= await exchange.connect(user1).depositToken(token1.address, amount)
    result=await transaction.wait()

    console.log(await token1.balanceOf(exchange.address))

//Withdraw tokens
    transaction= await exchange.connect(user1).withdrawToken(token1.address, amount)
    result=await transaction.wait()
})


it ('track the token withdrawal', async ()=>{
    expect(await token1.balanceOf(exchange.address)).to.equal(0)
    expect(await exchange.tokens(token1.address,user1.address)).to.equal(0)
    expect(await exchange.balanceOf(token1.address,user1.address)).to.equal(0)
})

it ('emits a withdraw event', async ()=>{
    const event=result.events[1]
    expect(event.event).to.equal('Withdraw')
    const args=event.args
    expect(args.token).to.equal(token1.address)
    expect(args.user).to.equal(user1.address)
    expect(args.amount).to.equal(amount)
    expect(args.balance).to.equal(0)
})

})

describe('Failure', () =>{

it('it fails for insufficient funds', async()=>{
    await expect(exchange.connect(user1).withdrawToken(token1.address,amount)).to.be.reverted
})

})

})

describe('Checking Balances',()=>{
    let transaction, result
    let amount= tokens(10)

    beforeEach(async ()=>{

    transaction=await token1.connect(user1).approve(exchange.address, amount)
    result=await transaction.wait()

    transaction=await token1.connect(deployer).transfer(user1.address, amount)
    result=await transaction.wait()

    transaction= await exchange.connect(user1).depositToken(token1.address, amount)
    result=await transaction.wait()

    })

    it('returns the balance', async ()=>{
       expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(amount)
    })
})

describe('Making orders',()=>{
    let transaction, result
    let amount=tokens(1)

describe('Success',()=>{
    beforeEach(async ()=>{
    //Deposit tokens before making order


    // Approve Token
    transaction=await token1.connect(user1).approve(exchange.address, amount)
    result=await transaction.wait()

    transaction=await token1.connect(deployer).transfer(user1.address, amount)
    result=await transaction.wait()

    // Deposit Token
    transaction= await exchange.connect(user1).depositToken(token1.address, amount)
    result=await transaction.wait()


    // Make Order
    transaction= await exchange.connect(user1).makeOrder(token2.address, amount, token1.address, amount)
    result=await transaction.wait()
    })

    it('tracks the newly created order', async ()=>{
        expect(await exchange.orderCount()).to.equal(1)
    })

    it ('emits an Order event', async ()=>{
    const event=result.events[0]
    expect(event.event).to.equal('Order')

    const args=event.args
    expect(args.id).to.equal(await exchange.orderCount())
    expect(args.user).to.equal(user1.address)
    expect(args.tokenGet).to.equal(token2.address)
    expect(args.amountGet).to.equal(amount)
    expect(args.tokenGive).to.equal(token1.address)
    expect(args.amountGive).to.equal(amount)
    expect(args.timestamp).to.at.least(1)
})

})

describe('Failure',()=>{
    it('reject if no balance', async()=>{
        await expect(exchange.connect(user1).makeOrder(token2.address,tokens(1),token1.address,tokens(1))).to.be.reverted
    })
})

})

describe('Order actions', ()=>{
    let transaction, result
    let amount =tokens(1)


    beforeEach(async ()=>{

    transaction=await token1.connect(user1).approve(exchange.address, amount)
    result=await transaction.wait()

    transaction=await token1.connect(deployer).transfer(user1.address, amount)
    result=await transaction.wait()

    transaction= await exchange.connect(user1).depositToken(token1.address, amount)
    result=await transaction.wait()

    transaction= await exchange.connect(user1).makeOrder(token2.address,tokens(1),token1.address,tokens(1))
    result=await transaction.wait()

    transaction=await token2.connect(deployer).transfer(user2.address,tokens(100))
    result=await transaction.wait()

    transaction=await token2.connect(user2).approve(exchange.address,tokens(2))
    result=await transaction.wait()

    transaction=await exchange.connect(user2).depositToken(token2.address, tokens(2))

    })

    describe('Cancelling orders', ()=>{
        describe('Success',()=>{
         beforeEach(async ()=>{
            transaction=await exchange.connect(user1).cancelOrder(1)
            result=await transaction.wait()
        })
         it('order cancelled', async ()=>{
            expect(await exchange.orderCancelled(1)).to.equal(true)
         })

         it ('emits a cancel event', async ()=>{
    const event=result.events[0]
    expect(event.event).to.equal('Cancel')

    const args=event.args
    expect(args.id).to.equal(await exchange.orderCount())
    expect(args.user).to.equal(user1.address)
    expect(args.tokenGet).to.equal(token2.address)
    expect(args.amountGet).to.equal(amount)
    expect(args.tokenGive).to.equal(token1.address)
    expect(args.amountGive).to.equal(amount)
    expect(args.timestamp).to.at.least(1)
        })      
    })
        describe('Failure',()=>{
          let invalidOrderId=9999

            it('rejects if order does not exist',async ()=>{
                await expect(exchange.connect(user1).cancelOrder(invalidOrderId)).to.be.reverted
            })

            it('rejects if canceled by unauthorized user', async ()=>{
                await expect(exchange.connect(user2).cancelOrder(1)).to.be.reverted
            })
        }) 
})

    describe('Filling Orders',()=>{
      describe("Success",()=>{

      beforeEach(async ()=>{
            transaction=await exchange.connect(user2).fillOrder('1')
            result=await transaction.wait()
        })
        it('Executes the trade and charges fees', async()=>{
            // Tokens Get
            expect(await exchange.balanceOf(token2.address,user2.address)).to.equal(tokens(0.9))
            expect(await exchange.balanceOf(token2.address,user1.address)).to.equal(tokens(1))
            expect(await exchange.balanceOf(token2.address,feeAccount.address)).to.equal(tokens(0.1))
            // Tokens Give
            expect(await exchange.balanceOf(token1.address,user2.address)).to.equal(tokens(1))
            expect(await exchange.balanceOf(token1.address,user1.address)).to.equal(tokens(0))
            expect(await exchange.balanceOf(token1.address,feeAccount.address)).to.equal(tokens(0))
        })
        it('updates filled orders', async()=>{
            expect(await exchange.orderFilled(1)).to.equal(true)
        })

        it ('emits a Trade event', async ()=>{
    const event=result.events[0]
    expect(event.event).to.equal('Trade')

    const args=event.args
    expect(args.id).to.equal('1')
    expect(args.user).to.equal(user2.address)
    expect(args.tokenGet).to.equal(token2.address)
    expect(args.amountGet).to.equal(amount)
    expect(args.tokenGive).to.equal(token1.address)
    expect(args.amountGive).to.equal(amount)
    expect(args.creater).to.equal(user1.address)
    expect(args.timestamp).to.at.least(1)
})            
})
      describe("Failure",()=>{

        it('rejects invalid order id', async()=>{
            const invalidOrderId=9999
            await expect(exchange.connect(user2).fillOrder(invalidOrderId)).to.be.reverted
        })

        it('rejects filled order to be rejected', async()=>{
            transaction=await exchange.connect(user2).fillOrder(1)
            await transaction.wait()
            await expect(exchange.connect(user2).fillOrder(1)).to.be.reverted
        })
        it('rejects cancelled order to be rejected', async()=>{
            transaction=await exchange.connect(user1).cancelOrder(1)
            await transaction.wait()
            await expect(exchange.connect(user2).fillOrder(1)).to.be.reverted

        })
      })
  

    })   
})
})

