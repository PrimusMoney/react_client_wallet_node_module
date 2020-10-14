const initialState = {
		fetchpending: false,
		fetchsuccess: false,
		array: [],
		openpending: false,
		opensuccess: false,
		error: null
}

const walletsReducer = (state = initialState, action) => {
	switch(action.type) {
		case 'RESET_WALLETS': 
			return Object.assign({}, state, {
				array: null,
				fetchpending: false,
				fetchsuccess: false
			});

		case 'FETCH_WALLETS_PENDING': 
			return Object.assign({}, state, {
				fetchpending: action.pending
			});
		 case 'FETCH_WALLETS_SUCCESS':
			 return Object.assign({}, state, {
			array: action.array,
			fetchsuccess: action.success
		});
		case 'FETCH_WALLETS_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});

			
			
		case 'RESET_WALLET': 
			return Object.assign({}, state, {
				walletname: null,
				walletuuid: null,
				opensuccess: false,
				openpending: false,
				islocked: true
			});

		case 'SET_WALLET': 
			return Object.assign({}, state, {
				walletname: action.walletname,
				walletuuid: action.walletuuid,
				opensuccess: false,
				openpending: false,
				islocked: true
			});

		case 'LOCK_WALLET': 
			return Object.assign({}, state, {
				opensuccess: false,
				openpending: false,
				islocked: true
			});

			
			
		case 'OPEN_WALLET_PENDING': 
			return Object.assign({}, state, {
				openpending: action.pending
			});
		case 'OPEN_WALLET_SUCCESS':
			return Object.assign({}, state, {
				walletname: action.walletname,
				walletuuid: action.walletuuid,
				opensuccess: action.success,
				islocked: (action.success ? false : true)
			});
		case 'OPEN_WALLET_ERROR':
				return Object.assign({}, state, {
					error: action.error
				});
				
				
		case 'CHECK_WALLET_LOCK_PENDING': 
			return Object.assign({}, state, {
				checkpending: action.pending
			});
		case 'CHECK_WALLET_LOCK_SUCCESS':
			return Object.assign({}, state, {
				walletname: action.walletname,
				walletuuid: action.walletuuid,
				islocked: action.islocked,
				checkedon: action.checkedon
			});
		case 'CHECK_WALLET_LOCK_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
				
				
		case 'CREATE_WALLET_PENDING': 
			return Object.assign({}, state, {
				createpending: action.pending
			});
		case 'CREATE_WALLET_SUCCESS':
			return Object.assign({}, state, {
				walletname: action.walletname,
				walletuuid: action.walletuuid,
				createsuccess: action.success,
				islocked: action.islocked
			});
		case 'CREATE_WALLET_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
			
			
		case 'IMPORT_WALLET_PENDING': 
			return Object.assign({}, state, {
				importpending: action.pending
			});
		case 'IMPORT_WALLET_SUCCESS':
			return Object.assign({}, state, {
				walletname: action.walletname,
				walletuuid: action.walletuuid,
				importsuccess: action.success,
				islocked: action.islocked
			});
		case 'IMPORT_WALLET_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
			
			
		case 'MODIFY_WALLET_PENDING': 
			return Object.assign({}, state, {
				modifypending: action.pending
			});
		case 'MODIFY_WALLET_SUCCESS':
			return Object.assign({}, state, {
				walletname: action.walletname,
				walletuuid: action.walletuuid,
				modifysuccess: action.success,
				islocked: action.islocked
			});
		case 'MODIFY_WALLET_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
				
				
		default: 
			return state;
	}
}

export default walletsReducer;
