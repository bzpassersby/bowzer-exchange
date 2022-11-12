const{ expect }= require('chai');
const{ ethers }=require('hardhat');
const tokens=(n)=>{
	return ethers.utils.parseUnits(n.toString(),'ether')
}

describe('Token',()=>{
	//Tests go inside here
let token,accounts,deployer, receiver



beforeEach(async ()=>{
	const Token=await ethers.getContractFactory('Token')
    token= await Token.deploy('Bowzer Coin','BOWZER','1000000')

    accounts = await ethers.getSigners()
    deployer= accounts[0]
    receiver= accounts[1]


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
        console.log(event)
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
})

