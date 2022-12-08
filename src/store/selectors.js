import { createSelector } from 'reselect'
import { get, groupBy, reject, maxBy, minBy} from 'lodash'
import { ethers } from 'ethers'
import moment  from 'moment'



const tokens = state => get(state, 'tokens.contracts')
const account = state => get(state, 'provider.account')

const allOrders = state => get(state, 'exchange.allOrders.data', [])
const cancelledOrders = state=>get(state, 'exchange.cancelledOrders.data',[])
const filledOrders= state=>get(state, 'exchange.filledOrders.data', [])

const openOrders = state => {
	const all=allOrders(state)
	const filled=filledOrders(state)
	const cancelled=cancelledOrders(state)

	const openOrders= reject(all, (order)=>{
      const orderFilled= filled.some((o)=>o.id.toString() === order.id.toString())
      const orderCancelled= cancelled.some((o)=>o.id.toString() === order.id.toString())
      return (orderFilled || orderCancelled)
	})
	return openOrders
}

const GREEN ='#25CE8F'
const RED =  '#F45353'


const decorateOrder=(order,tokens)=>{
    let token0Amount, token1Amount

    if (order.tokenGive===tokens[1].address) {
    	token0Amount=order.amountGive
    	token1Amount=order.amountGet
    } else {
    	token1Amount=order.amountGet
    	token0Amount=order.amountGive
    }

    //Calculate token price to 5 decimal places
    const percision=100000
    let tokenPrice= (token1Amount / token0Amount)
    tokenPrice= Math.round(tokenPrice * percision)  /  percision

	return({
		...order,
		token0Amount: ethers.utils.formatUnits(token0Amount,'ether'),
		token1Amount: ethers.utils.formatUnits(token1Amount,'ether'),
		tokenPrice,
        formattedTimestamp: moment.unix(order.timestamp).format('h:mm:ssa d MMM D')
	})
}

const decorateOrderBookOrder = (order,tokens)=>{
	const orderType= order.tokenGive === tokens[1].address ? 'buy' : 'sell'

     return({
     	...order,
     	orderType,
     	orderTypeClass: (orderType === 'buy' ? GREEN : RED),
     	orderFillAction: (orderType === 'buy' ? 'sell': 'buy')
     	})
}

const decorateOrderBookOrders =(orders, tokens)=>{
	return(
    orders.map((order)=>{
    order = decorateOrder(order,tokens)
    order = decorateOrderBookOrder(order,tokens)
	return(order)})
	)
}

//---------------------------------------
// ALL FILLED ORDERS

export const filledOrdersSelector = createSelector(
    filledOrders,
    tokens,
    (orders, tokens)=>{
    if (! tokens[0] || !tokens[1]) {return}
    // Filter orders by selected tokens
orders=orders.filter((o)=> o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
orders=orders.filter((o)=> o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

    // [x]Step 1: sort orders by time ascending
    // [x]Step 2: apply order colors (decorate orders)
    // [x]Step 3: sort orders by time descending for UI


    //Sort orders by time ascending for prie comparison
 orders= orders.sort((a,b)=>a.timestamp - b.timestamp)

   // Decorate the orders
 orders=decorateFilledOrders(orders,tokens)

   // Sort orders by date descending for display
 orders=orders.sort((a,b)=>b.timestamp - a.timestamp)


return orders
    }
)

const decorateFilledOrders = (orders, tokens) =>{
  // Track previous order to compare hisotry
  let previousOrder = orders[0]

  return(
   orders.map((order)=> {
    // decorate each individual order 
    order = decorateOrder(order,tokens)
    order = decorateFilledOrder(order, previousOrder)
    previousOrder = order 
    return order
   })
)
}

const decorateFilledOrder=(order, previousOrder)=>{

	return({
    ...order,
    tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id,previousOrder)
	})
}

const tokenPriceClass = (tokenPrice,orderId,previousOrder)=>{
  // Show green price if only one order exists
  if (previousOrder.id === orderId) {
  	return GREEN
  } 


  if(previousOrder.tokenPrice <= tokenPrice){
  	return GREEN
  } else {
  	return RED
  }
}

//---------------------------------------
//MY OPEN ORDERS
export const myOpenOrdersSelector=createSelector(
    account,
    tokens,
    openOrders,
    (account, tokens, orders)=>{
        if(!tokens[0] || !tokens[1] || !account ) {return}

    // Filter orders created by current account
    orders=orders.filter((o)=> o.user === account)

    // Filter orders by selected tokens
    orders=orders.filter((o)=> o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders=orders.filter((o)=> o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

    // Decorate orders - add display attributes
    orders=decorateMyOpenOrders(orders,tokens)
  
    // Sort orders by date descending
    orders= orders.sort((a,b)=>b.timestamp - a.timestamp)

    console.log(orders)
    
    return orders



    }

	)


const decorateMyOpenOrders =(orders, tokens)=>{
   return(
      orders.map((order)=>{
      	order=decorateOrder(order,tokens)
      	order=decorateMyOpenOrder(order,tokens)
      	return(order)
      }
   	))
}

const decorateMyOpenOrder = (order, tokens)=>{
let orderType= order.tokenGive === tokens[1].address ? 'buy' : 'sell'

return({
...order,
orderType,
orderTypeClass: (orderType==='buy'? GREEN : RED)
})
}




//---------------------------------------
// ORDER BOOK

export const orderBookSelector = createSelector(openOrders, tokens, (orders, tokens)=>{


if (!tokens[0] || !tokens[1]) {return}

// Filter orders by selected tokens
orders=orders.filter((o)=> o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
orders=orders.filter((o)=> o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

// Decorate orders
orders=decorateOrderBookOrders(orders,tokens)

// Group orders by 'orderType'
orders= groupBy(orders,'orderType')

const buyOrders= get(orders,'buy',[])

// Sort buy orders by token price
orders={
	...orders,
	buyOrders: buyOrders.sort((a,b)=>b.tokenPrice - a.tokenPrice)
}

const sellOrders=get(orders,'sell',[])

// Sort sell orders by token price
orders={
	...orders,
	sellOrders: sellOrders.sort((a,b)=>b.tokenPrice - a.tokenPrice)
}
return orders
})


//------------------------------------------
// PRICE CHART

export const priceChartSelector= createSelector(
       filledOrders,
       tokens,
       (orders,tokens) =>{
       	if (! tokens[0] || !tokens[1]) {return}

// Filter orders by selected tokens
orders=orders.filter((o)=> o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
orders=orders.filter((o)=> o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)

// Sort orders by date ascending to compare history
orders = orders.sort((a,b) => a.timestamp - b.timestamp)

// Decorate orders - add display attributes
orders = orders.map((o)=> decorateOrder(o,tokens))

// Get last 2 orders for final price & price change
let secondLastOrder, lastOrder
[secondLastOrder, lastOrder] = orders.slice(orders.length-2, orders.length)

// Get last order price
const lastPrice = get(lastOrder,'tokenPrice',0)

//Get second last order price
const secondLastPrice= get(secondLastOrder, 'tokenPrice',0)

return({
	lastPrice,
	lastPriceChange: (lastPrice >= secondLastPrice? '+' : '-'),
	series:[{
      data: buildGraphData(orders)
	}]
})
})

const buildGraphData=(orders)=> {
// Group the orders by hour for the graph
orders=groupBy(orders,(o)=> moment.unix(o.timestamp).startOf('hour').format())

// Get each hour where data exists
const hours=Object.keys(orders)

// Build the graph series
const graphData= hours.map((hour)=> {
	// Fetch all orders from current hour
	const group= orders[hour]
    //Calculate price values: open, high, low, close
    const open= group[0]
    const high= maxBy(group,'tokenPrice')
    const low = minBy(group,'tokenPrice')
    const close= group[group.length-1]

 return({
 	x: new Date(hour),
 	y: [open.tokenPrice,high.tokenPrice,low.tokenPrice,close.tokenPrice]
 })
})

return graphData

}






