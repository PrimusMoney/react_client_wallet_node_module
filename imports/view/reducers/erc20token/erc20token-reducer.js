const initialState = {
	pending: false,
	array: [],
	error: null
}

const erc20TokensReducer = (state = initialState, action) => {
	switch(action.type) {
		case 'RESET_ERC20_TOKENS': 
			return Object.assign({}, state, {
				array: null,
				fetchpending: false,
				fetchsuccess: false
			});

		case 'FETCH_ERC20_TOKENS_PENDING': 
			return Object.assign({}, state, {
				fetchpending: action.pending
			});
		case 'FETCH_ERC20_TOKENS_SUCCESS':
			return Object.assign({}, state, {
				fetchsuccess: action.success,
				array: action.array
			});
		case 'FETCH_ERC20_TOKENS_ERROR':
			return Object.assign({}, state, {
				error: action.error
			}
			);
			
		case 'OPEN_ERC20_TOKEN_PENDING': 
			return Object.assign({}, state, {
				openpending: action.pending
			});
		case 'OPEN_ERC20_TOKEN_SUCCESS':
			return Object.assign({}, state, {
				opensuccess: action.success,
				tokenname: action.tokenname,
				tokenuuid: action.tokenuuid
			});
		case 'OPEN_ERC20_TOKEN_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});

		case 'RESET_ERC20_TOKEN':
			return Object.assign({}, state, {
				openpending: false,
				opensuccess: false,
				tokenname: null,
				tokenuuid: null
			});
			
		case 'CREATE_ERC20_TOKEN_PENDING': 
			return Object.assign({}, state, {
				createpending: action.pending
			});
		case 'CREATE_ERC20_TOKEN_SUCCESS':
			return Object.assign({}, state, {
				createsuccess: action.success,
				tokenname: action.tokenname,
				tokenuuid: action.tokenuuid
			});
		case 'CREATE_ERC20_TOKEN_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});

			
		case 'IMPORT_ERC20_TOKEN_PENDING': 
			return Object.assign({}, state, {
				importpending: action.pending
			});
		case 'IMPORT_ERC20_TOKEN_SUCCESS':
			return Object.assign({}, state, {
				importsuccess: action.success,
				tokenname: action.tokenname,
				tokenuuid: action.tokenuuid
			});
		case 'IMPORT_ERC20_TOKEN_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});

			
		case 'MODIFY_ERC20_TOKEN_PENDING': 
			return Object.assign({}, state, {
				modifypending: action.pending
			});
		case 'MODIFY_ERC20_TOKEN_SUCCESS':
			return Object.assign({}, state, {
				modifysuccess: action.success,
				tokenname: action.tokenname,
				tokenuuid: action.tokenuuid
			});
		case 'MODIFY_ERC20_TOKEN_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});

			
		case 'TRANSFER_ERC20_TOKEN_PENDING': 
			return Object.assign({}, state, {
				transferpending: action.pending
			});
		case 'TRANSFER_ERC20_TOKEN_SUCCESS':
			return Object.assign({}, state, {
				transfersuccess: action.success,
				transfertokenuuid: action.tokenuuid,
				transfertocontactuuid: action.tocontactuuid,
				transferamount: action.amount,
			});
		case 'TRANSFER_ERC20_TOKEN_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});

			
		default: 
			return state;
	}
}

export default erc20TokensReducer;
