const initialState = {
	fetchpending: false,
	fetchsuccess: false,
	array: [],
	openpending: false,
	opensuccess: false,
	error: null
}

const transactionsReducer = (state = initialState, action) => {
	switch(action.type) {

	case 'FETCH_TRANSACTIONS_PENDING': 
		return Object.assign({}, state, {
			fetchpending: action.pending
		});
	case 'FETCH_TRANSACTIONS_SUCCESS':
		return Object.assign({}, state, {
			fetchsuccess: action.success,
			array: action.array
		});
	case 'FETCH_TRANSACTIONS_ERROR':
		return Object.assign({}, state, {
			error: action.error
		});
		
		
	case 'OPEN_TRANSACTION_PENDING': 
		return Object.assign({}, state, {
			openpending: action.pending
		});
	case 'OPEN_TRANSACTION_SUCCESS':
		return Object.assign({}, state, {
			opensuccess: action.success,
			transactionuuid: action.transactionuuid
		});
	case 'OPEN_TRANSACTION_ERROR':
		return Object.assign({}, state, {
			error: action.error
		});
		

	case 'RESET_TRANSACTION': 
		return Object.assign({}, state, {
			transactionuuid: null,
			opensuccess: false,
			openpending: false,
		});

	
	default: 
			return state;
	}
}

export default transactionsReducer;