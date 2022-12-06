import BOWZER from '../assets/bowzer.svg'
import {useSelector,useDispatch} from 'react-redux'
import {loadBalances,
	    transferTokens} from '../store/interactions'
import {useEffect,useState} from 'react'


const Balance=()=>{

const provider=useSelector(state=>state.provider.connection)
const symbols=useSelector(state=>state.tokens.symbols)
const exchange=useSelector(state=>state.exchange.contract)
const tokens=useSelector(state=>state.tokens.contracts)
const account=useSelector(state=>state.provider.account)
const tokenBalances=useSelector(state=>state.tokens.balances)
const exchangeBalances=useSelector(state=>state.exchange.balances)
const transferInProgress=useSelector(state=>state.exchange.transferInProgress)
const dispatch=useDispatch()

const [token1TransferAmount, setToken1TransferAmount]=useState(0)

const amountHandler=(e,token)=>{
	if (token.address === tokens[0].address){
	setToken1TransferAmount(e.target.value)
	}
}

// Step1: do transfer
// Step2: Notify app that transfer is pending
// Step3: Get confirmation from blockchain that transfer was successful
// Step4: Notify app that transfer was successful
// Step5: Notify app if transfer fails


const depositHandler=(e,token)=>{
	e.preventDefault()
    if (token.address === tokens[0].address){
      transferTokens(provider,exchange,'deposit',token,token1TransferAmount,dispatch)
      setToken1TransferAmount(0)
    }
}


useEffect(()=>{
  if(exchange && tokens[0] && tokens[1] && account) {
  console.log('loading balance...')
   const balance=loadBalances(exchange,tokens,account,dispatch)
 }
}, [exchange,tokens,account,transferInProgress])

return (
    <div className='component exchange__transfers'>
      <div className='component__header flex-between'>
        <h2>Balance</h2>
        <div className='tabs'>
          <button className='tab tab--active'>Deposit</button>
          <button className='tab'>Withdraw</button>
        </div>
      </div>

      {/* Deposit/Withdraw Component 1 (DApp) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>
        <p><small>Token </small><br /><img src={BOWZER} alt='Token Logo'/>{symbols&& symbols[0]}</p>
        <p><small>Wallet</small><br />{tokenBalances&& tokenBalances[0]}</p>
        <p><small>Exchange</small><br />{exchangeBalances && exchangeBalances[0]}</p>
        </div>

        <form onSubmit={(e)=>depositHandler(e,tokens[0])}>
          <label htmlFor="token0">{symbols && symbols[0]} Amount</label>
          <input type="text" 
          id='token0' 
          placeholder='0.0000' 
          value={token1TransferAmount===0? '' : token1TransferAmount}
          onChange={(e)=>amountHandler(e,tokens[0])}/>

          <button className='button' type='submit'>
            <span>Deposit</span>
          </button>
        </form>
      </div>

      <hr />

      {/* Deposit/Withdraw Component 2 (mETH) */}

      <div className='exchange__transfers--form'>
        <div className='flex-between'>

        </div>

        <form>
          <label htmlFor="token1"></label>
          <input type="text" id='token1' placeholder='0.0000'/>

          <button className='button' type='submit'>
            <span></span>
          </button>
        </form>
      </div>

      <hr />
    </div>
  );


}

export default Balance
