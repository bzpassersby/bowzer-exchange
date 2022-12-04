export const provider= (state={}, action) => {
	switch (action.type) {
		case 'PROVIDER_LOADED':
		return {
			...state,
			connection: action.connection
		}
		case 'NETWORK_LOADED':
		return{
			...state,
			chainId: action.chainId
		}
		case 'ACCOUNT_LOADED':
		return{
			...state,
			account: action.account
		}
		case 'ETHER_BALANCE_LOADED':
		return{
			...state,
			balance:action.balance
		}

	default:
	return state
}
}

const DEFAULT_TOKENS_STATES={
	loaded:false,
	contracts:[],
	symbols:[]
}

export const tokens= (state= DEFAULT_TOKENS_STATES, action) =>{
	switch (action.type) {
		case 'TOKEN_1_LOADED':
		return{
			...state,
			loaded:true,
			contracts:[...state.contracts,action.token],
			symbols:[...state.symbols,action.symbol]
		}

		case 'TOKEN_2_LOADED':
		return{
			...state,
			loaded:true,
			constracts:[...state.contracts,action.token],
			symbols:[...state.symbols,action.symbol]
		}

		default:
		return state

	}
}

const DEFAULT_EXCHANGE_STATE={
	loaded: false,
	constract: null
}

export const exchange= (state= DEFAULT_EXCHANGE_STATE, action) =>{
	switch (action.type) {
		case 'EXCHANGE_LOADED':
		return{
			loaded: true,
			contract: action.exchange
		}
		default:
		return state
	}

}
