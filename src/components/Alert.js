
import { useSelector} from 'react-redux'
import {useEffect, useRef} from 'react'
import config from '../config.json'

import { myEventSelector } from '../store/selectors'

const Alert = () => {
  const account = useSelector(state=>state.provider.account)
  const isPending =useSelector(state=>state.exchange.transaction.isPending)
  const isError=useSelector(state=>state.exchange.transaction.isError)
  const events=useSelector(myEventSelector)
  const network=useSelector(state=>state.provider.chainId)

  const alertRef=useRef(null)


  const removeHandler=()=>{
    alertRef.current.className='alert alert--remove'
  }

useEffect(()=>{
  if((isPending || isError) && account) {
    alertRef.current.className='alert'
  }
},[events,isPending,account,isError]
  )

  return (
    <div>
        {isPending? ( 
          <div className="alert alert--remove" onClick={removeHandler}  ref={alertRef}>
          <h1>Transaction Pending...</h1>
        </div>

        ): isError? (
         <div className="alert alert--remove" onClick={removeHandler}  ref={alertRef}>
          <h1>Transaction Will Fail</h1>
        </div>

        ): !isPending && events[0]?  (
        <div className="alert alert--remove" onClick={removeHandler}  ref={alertRef}>
          <h1>Transaction Successful</h1>
            <a
              href={config[network]? `${config[network].explorerURL}/tx/${events[0].transaction}`: '#'}
              target='_blank'
              rel='noreferrer'
            >
              {events[0].transactionHash.slice(0,6)+'...'+events[0].transactionHash.slice(60,66)}
            </a>
        </div>

        ) : (
          <div className="alert alert--remove" onClick={removeHandler}  ref={alertRef}>
          </div>
        )
      }
    </div>
  );
}

export default Alert;