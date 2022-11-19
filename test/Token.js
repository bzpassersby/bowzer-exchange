const{ expect }= require('chai');
const{ ethers }=require('hardhat');
const tokens=(n)=>{
	return ethers.utils.parseUnits(n.toString(),'ether')
}

describe('Token',()=>{
	//Tests go inside here
let token,accounts,deployer, receiver, spender



beforeEach(async ()=>{
	const Token=await ethers.getContractFactory('Token')
    token= await Token.deploy('Bowzer Coin','BOWZER','1000000')

    accounts = await ethers.getSigners()
    deployer= accounts[0]
    receiver= accounts[1]
    spender= accounts[2]


})

describe('Deployment',()=>{

const name='Bowzer Coin'
const symbol='BOWZER'
const decimals='18'
const totalSupply=tokens(1000000)

it('has a correct name',async ()=>{
   
	expect(await token.name()).to.equal(name)
})

it('has a correct symbol',async()=>{

    expect(await token.symbol()).to.equal(symbol)
})

it('has correct decimals',async()=>{

    expect(await token.decimals()).to.equal(decimals)
})

it('has correct total supply',async()=>{
    expect(await token.totalSupply()).to.equal(totalSupply)
})

it('has correct balance',async()=>{
    expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
})


})

describe('Sending Token', ()=>{
    let amount,transaction,result


describe("Success",()=>{

     beforeEach( async ()=>{
        amount=tokens(100)
        transaction= await token.connect(deployer).transfer(receiver.address, amount)
        result= await transaction.wait()

    })

    it('Transfers token balances', async ()=>{
        expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
        expect(await token.balanceOf(receiver.address)).to.equal(amount)

      })
    it('Emits a transfer event', async ()=>{
        let event=result.events[0]
        //console.log(event)
        expect(event.event).to.equal('Transfer')
        let args=event.args
        expect(args.to).to.equal(receiver.address)
        expect(args.from).to.equal(deployer.address)
        expect(args.value).to.equal(amount)
        
    })

describe("Failure",()=>{
    it("rejects insufficient funds", async ()=>{
        const invalidAmount= tokens(10000000)
        expect(token.connect(deployer).transfer(receiver.address,invalidAmount)).to.be.reverted
    })

    it("rejects sending to invalid address", async ()=>{
        amount=tokens(10)
        await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000',amount)).to.be.reverted
    })

})
        
    })
})

describe('Token Approvals', ()=>{

    describe('Success',()=>{
    
    beforeEach( async ()=>{
        amount=tokens(100)
        transaction = await token.connect(deployer).approve(spender.address,amount)
        result= await transaction.wait()
    })


    it('allowcates allowance to spender', async()=>{
        expect(await token.allowance(deployer.address,spender.address)).to.equal(amount)
    })

    it('emits an approval event', async()=>{
        let event=result.events[0]
        expect(event.event).to.equal('Approval')
        let args=event.args
        expect(args.owner).to.equal(deployer.address)
        expect(args.spender).to.equal(spender.address)
        expect(args.value).to.equal(amount)

    })

    })

    describe('Failure',()=>{
        it('rejects approving invalid address', async()=>{
        amount=tokens(100)
        await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000',amount)).to.be.reverted
        })
    })

describe('Transfer Deleggation',()=>{
    let amount, transaction, result

    beforeEach( async ()=>{
        amount= tokens(100)
        transaction=await token.connect(deployer).approve(spender.address, amount)
        result= await transaction.wait()
    })
     describe('Success', ()=>{
        beforeEach( async ()=>{
            transaction=await token.connect(spender).transferFrom(deployer.address,receiver.address,amount)
            result=await transaction.wait()
        })
    
        it('transfer tokens', async ()=>{
            expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
            expect(await token.balanceOf(receiver.address)).to.equal(amount)

        })

        it('resets allowance', async ()=>{
            expect(await token.allowance(deployer.address,spender.address)).to.equal(0)
        })

        it('Emits a transfer event', async ()=>{
        let event=result.events[0]
        console.log(event)
        expect(event.event).to.equal('Transfer')
        let args=event.args
        expect(args.to).to.equal(receiver.address)
        expect(args.from).to.equal(deployer.address)
        expect(args.value).to.equal(amount)
        
    })

     })

     describe('Failure', ()=>{
        //Attempts to transfer too mnany tokens
        it('rejects if attempted to transfer too many tokens', async()=>{
        const invalidAmount = tokens(100000000)
        await expect(token.connect(spender).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted
        })
   

     })



})


})
})

