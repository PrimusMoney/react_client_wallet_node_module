// actions
function fetchWalletListPending(ispending) {
	return {
		type: 'FETCH_WALLETS_PENDING',
		pending: ispending
	}
};

function fetchWalletListSuccess(array, success) {
	return {
		type: 'FETCH_WALLETS_SUCCESS',
		array: array,
		success: success
	}
};

function fetchWalletListError(error) {
	return {
		type: 'FETCH_WALLETS_ERROR',
		error: error
	}
};


// action creators
export const doFetchWalletList = (mvcmodule, sessionuuid, callback) => {
	console.log('doFetchWalletList called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let session;

	return dispatch => {
		dispatch(fetchWalletListPending(true));
		dispatch(fetchWalletListSuccess(null));
		dispatch(fetchWalletListError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.getWalletList(session, true)
		})
		.then((walletarray) => {
			var wallets = [];
			
			if (walletarray) {
				for (var i = 0; i < walletarray.length; i++) {
					var wallet = {
							uuid: walletarray[i].getWalletUUID(),
							name: walletarray[i].getName(),
							label: walletarray[i].getLabel(),
							type: walletarray[i].getWalletType(),
							locked: walletarray[i].isLocked(),
					};
					wallets.push(wallet);
				}
				
				dispatch(fetchWalletListSuccess(wallets, true));
				dispatch(fetchWalletListPending(false));
				
				if (callback)
					callback(null, wallets);
				
				return wallets;
			}
			else {
				dispatch(fetchWalletListError('no list returned'));
				dispatch(fetchWalletListSuccess(wallets, false));
				dispatch(fetchWalletListPending(false));
				
				throw new Error('ERR_NO_RESULT');
			}
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}			
			
			dispatch(fetchWalletListError(err));
			dispatch(fetchWalletListSuccess([], false));
			dispatch(fetchWalletListPending(false));
			
			if (callback)
				callback(err, null);
			
	 	});
		 
	};
};

//actions
export function resetWallets() {
	return {
		type: 'RESET_WALLETS'
	};
};

//action creator
export const doResetWallets = () => {
	return dispatch => {
		dispatch(resetWallets());
	};
};



//actions
export function setOpenWalletPending(pending) {
	return {
		type: 'OPEN_WALLET_PENDING',
		pending: pending
	};
};

export function setOpenWalletSuccess(walletname, walletuuid, success) {
	return {
		type: 'OPEN_WALLET_SUCCESS',
		walletname: walletname,
		walletuuid: walletuuid,
		success: success
	};
};

export function setOpenWalletError(error) {
	return {
		type: 'OPEN_WALLET_ERROR',
		error: error
	};
};

//action creator
export const doOpenWallet = (mvcmodule, sessionuuid, walletuuid, walletname, password, callback) => {
	console.log('doOpenWallet called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();

	let session;
	let wallet;
	
	return dispatch => {
		dispatch(setOpenWalletPending(true));
		dispatch(setOpenWalletSuccess(walletname, walletuuid, false));
		dispatch(setOpenWalletError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			if (walletuuid)
				return mobilecontrollers.openWalletFromUUID(session, walletuuid, password)
			else
				return mobilecontrollers.openWallet(session, walletname, password)
		})
		.then((res) => {
			wallet = res;
			
			if (wallet) {
				dispatch(setOpenWalletSuccess(wallet.getName(), wallet.getWalletUUID(), true));
				dispatch(setOpenWalletPending(false));
				
				if (callback)
					callback(null, true);
				
				return wallet;
			}
			else {
				dispatch(setOpenWalletError('could not open wallet ' + walletname + ' with provided password'));
				dispatch(setOpenWalletSuccess(walletname, walletuuid, false));
				dispatch(setOpenWalletPending(false));
				
				throw new Error('ERR_WRONG_PASSWORD');
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
			
			dispatch(setOpenWalletError(err));
			dispatch(setOpenWalletSuccess(walletname, walletuuid, false));
			dispatch(setOpenWalletPending(false));
			
			if (callback)
				callback(err, null);
		});
		
	};
};

//actions
export function setCheckWalletLockPending(pending) {
	return {
		type: 'CHECK_WALLET_LOCK_PENDING',
		pending: pending
	};
};

export function setCheckWalletLockSuccess(walletname, walletuuid, islocked, date) {
	return {
		type: 'CHECK_WALLET_LOCK_SUCCESS',
		walletname: walletname,
		walletuuid: walletuuid,
		islocked: islocked,
		checkedon: date
	};
};

export function setCheckWalletLockError(error) {
	return {
		type: 'CHECK_WALLET_LOCK_ERROR',
		error: error
	};
};

//action creator
export const doCheckWalletLock = (mvcmodule, sessionuuid, walletuuid, callback) => {
	console.log('doCheckWalletLock called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();

	let session;
	let wallet;
	let walletname;
	var now = Date.now();
	
	return dispatch => {
		dispatch(setCheckWalletLockPending(true));
		dispatch(setCheckWalletLockSuccess(walletname, walletuuid, false, now));
		dispatch(setCheckWalletLockError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.getWalletFromUUID(session, walletuuid)
		})
		.then((res) => {
			wallet = res;
			walletname = wallet.getName();
			
			return wallet.isLocked();
		}) 
		.then((islocked) => {
			let walletuuid = wallet.getWalletUUID();
			
			dispatch(setCheckWalletLockSuccess(walletname, walletuuid, islocked, now));
			dispatch(setCheckWalletLockPending(false));
			
			if (callback)
				callback(null, islocked);

			return islocked;
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
			
			dispatch(setCheckWalletLockError(err));
			dispatch(setCheckWalletLockSuccess(walletname, walletuuid, true, now));
			dispatch(setCheckWalletLockPending(false));
			
			if (callback)
				callback(err, true);
		});
		
	};
};

//actions
export function resetWallet() {
	return {
		type: 'RESET_WALLET'
	};
};

//action creator
export const doResetWallet = () => {
	return dispatch => {
		dispatch(resetWallet());
		
		// reset erc20 token
		dispatch({type: 'RESET_ERC20_TOKEN'});
		
		// reset erc20 token list
		dispatch({type: 'RESET_ERC20_TOKENS'});

		// reset card
		dispatch({type: 'RESET_CARD'});
		
		// reset card list
		dispatch({type: 'RESET_CARDS'});
	};
};

//actions
export function setWallet(walletname, walletuuid) {
	return {
		type: 'SET_WALLET',
		walletname: walletname,
		walletuuid: walletuuid
	};
};

//action creator
export const doSetWallet = (walletname, walletuuid) => {
	return dispatch => {
		dispatch(setWallet(walletname, walletuuid));
	};
};

//actions
export function lockWallet() {
	return {
		type: 'LOCK_WALLET'
	};
};

//action creator
export const doLockWallet = () => {
	return dispatch => {
		dispatch(lockWallet());
	};
};

//actions
function createWalletPending(ispending) {
	return {
		type: 'CREATE_WALLET_PENDING',
		pending: ispending
	}
};

function createWalletSuccess(walletname, walletuuid, success) {
	return {
		type: 'CREATE_WALLET_SUCCESS',
		walletname: walletname,
		walletuuid: walletuuid,
		islocked: (success ? false : true),
		success: success
	}
};

function createWalletError(error) {
	return {
		type: 'CREATE_WALLET_ERROR',
		error: error
	}
};


// action creators
export const doCreateWallet = (mvcmodule, sessionuuid, walletname, password, callback) => {
	console.log('doCreateWallet called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let session;
	let wallet;
	
	return dispatch => {
		dispatch(createWalletPending(true));
		dispatch(createWalletSuccess(walletname, null, false));
		dispatch(createWalletError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.createWallet(session, walletname, password);
		})
		.then((res) => {
			wallet = res;
			
			if (wallet) {
				return wallet.unlock(password);
			}
			else {
				dispatch(createWalletError('could not create wallet ' + walletname));
				dispatch(createWalletSuccess(walletname, null, false));
				dispatch(createWalletPending(false));
				
				throw new Error('ERR_COULD_NOT_CREATE_WALLET');

			}
		})
		.then((res) => {
			// refresh wallet list
			dispatch(doFetchWalletList(mvcmodule, sessionuuid));
			
			return res;
		})
		.then((res) => {
			let walletuuid = wallet.getWalletUUID();
			
			dispatch(createWalletSuccess(walletname, walletuuid, true));
			dispatch(createWalletPending(false));
			
			if (callback)
				callback(null, walletuuid);
			
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}			
			
			dispatch(createWalletError(err));
			dispatch(createWalletSuccess(walletname, null, false));
			dispatch(createWalletPending(false));

			
			if (callback)
				callback(err, null);
		});
		
	};
};


//actions
function importWalletPending(ispending) {
	return {
		type: 'IMPORT_WALLET_PENDING',
		pending: ispending
	}
};

function importWalletSuccess(walletname, walletuuid, success) {
	return {
		type: 'IMPORT_WALLET_SUCCESS',
		walletname: walletname,
		walletuuid: walletuuid,
		islocked: (success ? false : true),
		success: success
	}
};

function importWalletError(error) {
	return {
		type: 'IMPORT_WALLET_ERROR',
		error: error
	}
};


// action creators
export const doImportWallet = (mvcmodule, sessionuuid, url, authname, password, options, callback) => {
	console.log('doCreateWallet called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let session;
	let wallet;
	let walletname = (options.walletname ? options.walletname : options)
	
	return dispatch => {
		dispatch(importWalletPending(true));
		dispatch(importWalletSuccess(walletname, null, false));
		dispatch(importWalletError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.importWallet(session, url, authname, password, options)
		})
		.then((res) => {
			wallet = res;
			
			if (wallet) {
				return wallet.unlock(password);
			}
			else {
				dispatch(importWalletError('could not import wallet ' + walletname));
				dispatch(importWalletSuccess(walletname, null, false));
				dispatch(importWalletPending(false));
				
				throw new Error('ERR_COULD_NOT_IMPORT_WALLET');

			}
		})
		.then((unlocked) => {
			wallet.setLabel(walletname);
			
			return wallet.save()
		})
		.then((res) => {
			// refresh wallet list
			dispatch(doFetchWalletList(mvcmodule, sessionuuid));
			
			return res;
		})
		.then(() => {
			let walletuuid = wallet.getWalletUUID();
			
			dispatch(importWalletSuccess(walletname, walletuuid, true));
			dispatch(importWalletPending(false));
			
			if (callback)
				callback(null, walletuuid);
			
			return walletuuid;
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}			
			
			dispatch(importWalletError(err));
			dispatch(importWalletSuccess(walletname, null, false));
			dispatch(importWalletPending(false));

			
			if (callback)
				callback(err, null);
		});
		
	};
};


//actions
function modifyWalletPending(ispending) {
	return {
		type: 'MODIFY_WALLET_PENDING',
		pending: ispending
	}
};

function modifyWalletSuccess(walletname, walletuuid, success) {
	return {
		type: 'MODIFY_WALLET_SUCCESS',
		walletname: walletname,
		walletuuid: walletuuid,
		islocked: (success ? false : true),
		success: success
	}
};

function modifyWalletError(error) {
	return {
		type: 'MODIFY_WALLET_ERROR',
		error: error
	}
};


// action creators
export const doModifyWallet = (mvcmodule, sessionuuid, walletuuid, walletinfo, callback) => {
	console.log('doModifyWallet called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let session;
	let wallet;
	
	let walletname = walletinfo.name;
	
	return dispatch => {
		dispatch(modifyWalletPending(true));
		dispatch(modifyWalletSuccess(walletname, walletuuid, false));
		dispatch(modifyWalletError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.modifyWallet(session, walletuuid, walletinfo);
		})
		.then((res) => {
			wallet = res;
			
			if (wallet) {
				return wallet;
			}
			else {
				dispatch(modifyWalletError('could not modify wallet ' + walletname));
				dispatch(modifyWalletSuccess(walletname, walletuuid, false));
				dispatch(modifyWalletPending(false));
				
				
				throw new Error('ERR_COULD_NOT_MODIFY_WALLET');

			}
		})
		.then((modified) => {
			let walletuuid = wallet.getWalletUUID();
			
			dispatch(modifyWalletSuccess(walletname, walletuuid, true));
			dispatch(modifyWalletPending(false));
			
			if (callback)
				callback(null, wallet);
			
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}			
			
			dispatch(modifyWalletError(err));
			dispatch(modifyWalletSuccess(walletname, walletuuid, false));
			dispatch(modifyWalletPending(false));

			
			if (callback)
				callback(err, null);
		});
		
	};
};


