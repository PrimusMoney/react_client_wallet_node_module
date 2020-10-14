// actions
export function fetchTransactionListPending(ispending) {
	return {
		type: 'FETCH_TRANSACTIONS_PENDING',
		pending: ispending
	};
};

export function fetchTransactionListSuccess(success, transactionarray) {
	return {
		type: 'FETCH_TRANSACTIONS_SUCCESS',
		success: success,
		array: transactionarray
	};
};

export function fetchTransactionListError(error) {
	return {
		type: 'FETCH_TRANSACTIONS_ERROR',
		error: error
	};
};

// action creator
export const doFetchTransactions = (mvcmodule, sessionuuid, walletuuid, callback) => {
	console.log('doFetchTransactions called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();

	let session;
	let walletname;
	
	return dispatch => {
		dispatch(fetchTransactionListPending(true));
		dispatch(fetchTransactionListSuccess(false, []));
		dispatch(fetchTransactionListError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			return mobilecontrollers.getWalletFromUUID(session, walletuuid)
		})
		.then((wallet) => {
			walletname = wallet.getName();
			
			return wallet.getTransactionList(true);
		})
		.then((transactionarray) => {
	
			var transactions = [];

			if (transactionarray) {
				
				for (var i = 0; i < transactionarray.length; i++) {
					var transaction = {
							uuid: transactionarray[i].getTransactionUUID(),
							walletuuid: transactionarray[i].getWalletUUID(),
							carduuid: transactionarray[i].getCardUUID(),
							transactionhash: transactionarray[i].getTransactionHash(),
							label: transactionarray[i].getLabel(),
							type: transactionarray[i].getOrigin(),
							from: transactionarray[i].getFrom(),
							to: transactionarray[i].getTo(),
							creationdate: transactionarray[i].getCreationDate(),
							value: transactionarray[i].getValue(),
							status: transactionarray[i].getStatus(),
							xtra_data: transactionarray[i].getXtraData(),
						};
					
					transactions.push(transaction);
				}
				
				dispatch(fetchTransactionListSuccess(true, transactions));
				dispatch(fetchTransactionListPending(false));
				
				if (callback)
					callback(null, transactions);
				
				return transactions;
			}
			else {
				dispatch(fetchTransactionListError('could not find list of transactions for wallet ' + walletname));
			 	dispatch(fetchTransactionListSuccess(false, []));
				dispatch(fetchTransactionListPending(false));
				
				throw new Error('ERR_NO_RESULT');
			}
			
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}			
			else if (err.message == 'ERR_WALLET_NOT_FOUND') {
				dispatch({type: 'RESET_WALLET'});
			}			
			else if (err.message == 'ERR_WALLET_LOCKED') {
				dispatch({type: 'LOCK_WALLET'});
			}
			else if (err == 'ERR_TRANSACTION_NOT_FOUND') {
				dispatch({type: 'RESET_TRANSACTION'});
				
			}

			
			dispatch(fetchTransactionListError(err));
			dispatch(fetchTransactionListPending(false));
			
			if (callback)
				callback(err, null);
		});
		
	};
};

//actions
export function resetTransaction() {
	return {
		type: 'RESET_TRANSACTION'
	};
};

//action creator
export const doResetTransaction = () => {
	return dispatch => {
		dispatch(resetTransaction());
	};
};



//actions
export function setOpenTransactionPending(pending) {
	return {
		type: 'OPEN_TRANSACTION_PENDING',
		pending: pending
	};
};

export function setOpenTransactionSuccess(transactionuuid, success) {
	return {
		type: 'OPEN_TRANSACTION_SUCCESS',
		transactionuuid: transactionuuid,
		success: success
	};
};

export function setOpenTransactionError(error) {
	return {
		type: 'OPEN_TRANSACTION_ERROR',
		error: error
	};
};

//action creator
export const doOpenTransaction = (mvcmodule, sessionuuid, walletuuid, transactionuuid, callback) => {
	console.log('doOpenTransaction called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();

	let session;
	let walletname;
	let transaction;
	
	return dispatch => {
		dispatch(setOpenTransactionPending(true));
		dispatch(setOpenTransactionSuccess(transactionuuid, false));
		dispatch(setOpenTransactionError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.getWalletFromUUID(session, walletuuid)
		})
		.then((wallet) => {
			walletname = wallet.getName();
			
			return wallet.getTransactionFromUUID(transactionuuid);
		})
		.then((res) => {
			transaction = res;
			
			if (transaction) {
				dispatch(setOpenTransactionSuccess(transactionuuid, true));
				dispatch(setOpenTransactionPending(false));
				
				if (callback)
					callback(null, true);
				
				return transaction;
			}
			else {
				dispatch(setOpenTransactionError('could not open transaction ' + transactionuuid));
				dispatch(setOpenTransactionSuccess(transactionuuid, false));
				dispatch(setOpenTransactionPending(false));
				
				throw new Error('ERR_COULD_NOT_OPEN_TRANSACTION');
			}
			
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}
			else if (err.message == 'ERR_WALLET_NOT_FOUND') {
				dispatch({type: 'RESET_WALLET'});
			}			
			else if (err.message == 'ERR_WALLET_LOCKED') {
				dispatch({type: 'LOCK_WALLET'});
			}
			
			dispatch(setOpenTransactionError(err));
			dispatch(setOpenTransactionSuccess(transactionuuid, false));
			dispatch(setOpenTransactionPending(false));
			
			if (callback)
				callback(err, null);
		});
		
	};
};



