import {useEffect} from 'react';

import config from '../config.json'

import {useDispatch} from 'react-redux'
import {loadProvider,
        loadNetwork,
        loadAccount,
        loadTokens,
        loadExchange
      } from'../store/interactions'

import Navbar from'./Navbar'



function App() {
  const dispatch = useDispatch()

  const loadBlockchainData = async ()=>{

  // Connect Ethers to blockchain
  const provider= await loadProvider(dispatch)

  // Fetch current chainID (eg: hardhat 31337, kovan 42)
  const chainId=await loadNetwork(provider, dispatch)

  // Fetch current account and balance from Metamask when account changed
  window.ethereum.on('accountsChanged',()=>{
  loadAccount(provider,dispatch)
  })

  window.ethereum.on('chainChanged',()=>{
    window.location.reload()
  })

  
  // Load Token Smart Contract
  const BOWZER=config[chainId].bowzer
  const mETH=config[chainId].mETH
  await loadTokens(provider, [BOWZER.address,mETH.address], dispatch)

  //Load Exchange Smart Contract
  const exchangeConfig=config[chainId].exchange
  await loadExchange(provider, exchangeConfig.address,dispatch)

}

useEffect(()=>{
  loadBlockchainData()
})


  return (
    <div>
 
      <Navbar/>
      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}
    </div>
  )
}

export default App;
