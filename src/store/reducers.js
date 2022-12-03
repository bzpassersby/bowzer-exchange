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

	default:
	return state
}
}

export const tokens= (state={loaded:false, token:null, symbol:null}, action) =>{
	switch (action.type) {
		case 'TOKEN_LOADED':
		return{
			...state,
			loaded:true,
			token:action.token,
			symbol:action.symbol
		}

		default:
		return state

	}
}

