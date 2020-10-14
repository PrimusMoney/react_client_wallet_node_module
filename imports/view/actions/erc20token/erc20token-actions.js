// actions
function fetchERC20TokenListPending(ispending) {
	return {
		type: 'FETCH_ERC20_TOKENS_PENDING',
		pending: ispending
	}
};

function fetchERC20TokenListSuccess(tokenarray) {
	return {
		type: 'FETCH_ERC20_TOKENS_SUCCESS',
		array: tokenarray
	}
};

function fetchERC20TokenListError(error) {
	return {
		type: 'FETCH_ERC20_TOKENS_ERROR',
		error: error
	}
};

// action creators
export const doFetchERC20Tokens = (mvcmodule, sessionuuid, walletuuid, carduuid, callback) => {
	console.log('doFetchERC20Tokens called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();

	let session;
	let walletname;
	
	return dispatch => {
		dispatch(fetchERC20TokenListPending(true));
		dispatch(fetchERC20TokenListSuccess(null));
		dispatch(fetchERC20TokenListError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.getWalletFromUUID(session, walletuuid)
		})
		.then((wallet) => {
			walletname = wallet.getName();
			
			return wallet.getCardFromUUID(carduuid);
		})
		.then((card) => {
			if (card.isLocked()) {
				var promise_isunlocked = card.unlock();
			}
			else {
				var promise_isunlocked = Pomise.resolve(true);
			}
				
			
			return promise_isunlocked
			.then(() => {
				return card.getTokenAccountList(true);
			});
		})
		.then((tokenaccountarray) => {
			dispatch(fetchERC20TokenListPending(false));

			var tokenaccounts = [];

			if (tokenaccountarray) {
				var tokenpromises = [];
				
				for (var i = 0; i < tokenaccountarray.length; i++) {
					var tokenaccount = {
							uuid: tokenaccountarray[i].getTokenAccountUUID(), 
							tokenaddress: tokenaccountarray[i].getTokenAddress(), 
							label: tokenaccountarray[i].getLabel(), 
							name: tokenaccountarray[i].getName(), 
							symbol: tokenaccountarray[i].getSymbol(),
							decimals: tokenaccountarray[i].getDecimals(),
							totalsupply: tokenaccountarray[i].getTotalSupply(),
							description: tokenaccountarray[i].getDescription(),
							type: tokenaccountarray[i].getTokenAccountType(),

						};
					
					// retrieve positions, before returning success
					var retrieveposition = (tka, tk) => {
						return tka.getPosition().then((position) =>{
							tk.position = position
						})
						.catch((err) => {
							console.log('error retrieving token account position: ' + err);
							tk.position = 'unknown';
						});
					}
					tokenpromises.push(retrieveposition(tokenaccountarray[i], tokenaccount));
					
					tokenaccounts.push(tokenaccount);
				}
				
				return Promise.all(tokenpromises).then((arr) => {
					dispatch(fetchERC20TokenListSuccess(tokenaccounts));
					
					if (callback)
					callback(null, tokenaccounts);
				
					return tokenaccounts;
				});
			
				
			}
			else {
				dispatch(fetchWalletListError('no list returned'));
				
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
			else if (err == 'ERR_CARD_NOT_FOUND') {
				dispatch({type: 'RESET_CARD'});
				
			}
			else if (err == 'ERR_CARD_LOCKED') {
				dispatch({type: 'LOCK_CARD'});
			}
			
			dispatch(fetchERC20TokenListPending(false));
			dispatch(fetchERC20TokenListError(err));
			
			if (callback)
				callback(err, null);
		});
		
	};
};

//actions
export function resetERC20Tokens() {
	return {
		type: 'RESET_ERC20_TOKENS'
	};
};

//action creator
export const doResetERC20Tokens = () => {
	return dispatch => {
		dispatch(resetERC20Tokens());
	};
};




//actions
export function setOpenERC20TokenPending(pending) {
	return {
		type: 'OPEN_ERC20_TOKEN_PENDING',
		pending: pending
	};
};

export function setOpenERC20TokenSuccess(tokenname, tokenuuid, success) {
	return {
		type: 'OPEN_ERC20_TOKEN_SUCCESS',
		tokenname: tokenname,
		tokenuuid: tokenuuid,
		success: success
	};
};

export function setOpenERC20TokenError(error) {
	return {
		type: 'OPEN_ERC20_TOKEN_ERROR',
		error: error
	};
};

//action creator
export const doOpenERC20Token = (mvcmodule, sessionuuid, walletuuid, carduuid, tokenuuid, callback) => {
	console.log('doOpenERC20Token called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();

	let session;
	let wallet;
	let walletname;
	let card;
	let cardname;
	let tokenaccount;
	let tokenname = tokenuuid;
	
	return dispatch => {
		dispatch(setOpenERC20TokenPending(true));
		dispatch(setOpenERC20TokenSuccess(tokenname, tokenuuid, false));
		dispatch(setOpenERC20TokenError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.getWalletFromUUID(session, walletuuid)
		})
		.then((wllt) => {
			wallet = wllt;
			walletname = wallet.getName();
			
			return wallet.getCardFromUUID(carduuid);
		})
		.then((crd) => {
			card = crd;
			cardname = card.getLabel();
			
			if (card.isLocked()) {
				var promise_isunlocked = card.unlock();
			}
			else {
				var promise_isunlocked = Pomise.resolve(true);
			}
			
			return promise_isunlocked;
		}) 
		.then((isunlocked) => {
			
			if (isunlocked) {
				return card.getTokenAccountFromUUID(tokenuuid);
			}
			else {
				throw new Error('ERR_CARD_LOCKED');
			}
			
		})
		.then((tkna) => {
			tokenaccount = tkna;
			
			tokenname = tokenaccount.getLabel();
			
			dispatch(setOpenERC20TokenSuccess(tokenname, tokenuuid, true));
			dispatch(setOpenERC20TokenPending(false));
			
			if (callback)
				callback(null, true);
			
			return true;
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
			else if (err == 'ERR_CARD_NOT_FOUND') {
				dispatch({type: 'RESET_CARD'});
				
			}
			else if (err == 'ERR_CARD_LOCKED') {
				dispatch({type: 'LOCK_CARD'});
			}
			
			dispatch(setOpenERC20TokenError(err));
			dispatch(setOpenERC20TokenSuccess(tokenname, tokenuuid, false));
			dispatch(setOpenERC20TokenPending(false));
			
			if (callback)
				callback(err, null);
		});
		
	};
};

//actions
export function resetERC20Token() {
	return {
		type: 'RESET_ERC20_TOKEN'
	};
};

//action creator
export const doResetERC20Token = () => {
	return dispatch => {
		dispatch(resetERC20Token());
	};
};





//actions
function createERC20TokenPending(ispending) {
	return {
		type: 'CREATE_ERC20_TOKEN_PENDING',
		pending: ispending
	}
};

function createERC20TokenSuccess(tokenname, tokenuuid, success) {
	return {
		type: 'CREATE_ERC20_TOKEN_SUCCESS',
		tokenname: tokenname,
		tokenuuid: tokenuuid,
		success: success
	}
};

function createERC20TokenError(error) {
	return {
		type: 'CREATE_ERC20_TOKEN_ERROR',
		error: error
	}
};


//action creators
export const doCreateERC20Token = (mvcmodule, sessionuuid, walletuuid, carduuid, tokenname, symbol, totalsupply, callback) => {
	console.log('doCreateERC20Token called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let password = null; // only client card for the moment
	let address = null; // let wallet generate and store a private key
	
	let session;
	let wallet;
	let walletname;
	let card;
	let token;
	let tokenaccount;
	
	return dispatch => {
		dispatch(createERC20TokenPending(true));
		dispatch(createERC20TokenSuccess(null, null, false));
		dispatch(createERC20TokenError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.getWalletFromUUID(session, walletuuid)
		})
		.then((res) => {
			wallet = res;
			walletname = wallet.getName();
			
			return wallet.getCardFromUUID(carduuid);
		})
		.then((res) => {
			card = res;
			
			if (card.isLocked()) {
				var promise_isunlocked = card.unlock();
			}
			else {
				var promise_isunlocked = Pomise.resolve(true);
			}
			
			return promise_isunlocked;
		}) 
		.then((isunlocked) => {
			
			if (isunlocked) {
				var decimals = 2; // DEFAULT_TOKEN_DECIMALS = 2
				return card.deployToken(tokenname, symbol, totalsupply, decimals);
			}
			else {
				throw new Error('ERR_CARD_LOCKED');
			}
			
		})
		.then((tkn) => {
			token = tkn;
			
			if (token) {
				return card.createTokenAccount(token);
			}
			else {
				throw new Error('ERR_COULD_NOT_CREATE_TOKEN');

			}
		})
		.then((tkna) => {
			tokenaccount = tkna;
			
			if (tokenaccount) {
				let tokenaccountuuid = tokenaccount.getTokenAccountUUID();
				
				dispatch(createERC20TokenSuccess(tokenname, tokenaccountuuid, true));
				dispatch(createERC20TokenPending(false));
				
				if (callback)
					callback(null, tokenaccount);
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
			else if (err == 'ERR_CARD_NOT_FOUND') {
				dispatch({type: 'RESET_CARD'});
				
			}
			else if (err == 'ERR_CARD_LOCKED') {
				dispatch({type: 'LOCK_CARD'});
			}
			
			dispatch(createERC20TokenError(err));
			dispatch(createERC20TokenSuccess(null, null, false));
			dispatch(createERC20TokenPending(false));

			
			if (callback)
				callback(err, null);
		});
		
	};
};




//actions
function importERC20TokenPending(ispending) {
	return {
		type: 'IMPORT_ERC20_TOKEN_PENDING',
		pending: ispending
	}
};

function importERC20TokenSuccess(tokenname, tokenuuid, success) {
	return {
		type: 'IMPORT_ERC20_TOKEN_SUCCESS',
		tokenname: tokenname,
		tokenuuid: tokenuuid,
		success: success
	}
};

function importERC20TokenError(error) {
	return {
		type: 'IMPORT_ERC20_TOKEN_ERROR',
		error: error
	}
};


//action creators
export const doImportERC20Token = (mvcmodule, sessionuuid, walletuuid, carduuid, tokenuuid, tokenname, callback) => {
	console.log('doImportERC20Token called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let password = null; // only client card for the moment
	let address = null; // let wallet generate and store a private key
	
	let session;
	let wallet;
	let walletname;
	let card;
	let tokenaccount;
	
	return dispatch => {
		dispatch(importERC20TokenPending(true));
		dispatch(importERC20TokenSuccess(null, null, false));
		dispatch(importERC20TokenError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.getWalletFromUUID(session, walletuuid)
		})
		.then((res) => {
			wallet = res;
			walletname = wallet.getName();
			
			return wallet.getCardFromUUID(carduuid);
		})
		.then((res) => {
			card = res;
			
			if (card.isLocked()) {
				var promise_isunlocked = card.unlock();
			}
			else {
				var promise_isunlocked = Pomise.resolve(true);
			}
			
			return promise_isunlocked;
		}) 
		.then((isunlocked) => {
			
			if (isunlocked) {
				return card.importTokenAccount(tokenuuid);
			}
			else {
				throw new Error('ERR_CARD_LOCKED');
			}
			
		})
		.then((res) => {
			tokenaccount = res;
			
			if (tokenaccount) {
				tokenaccount.setLabel(tokenname);
				
				return tokenaccount._update();
			}
			else {
				throw new Error('ERR_COULD_NOT_IMPORT_TOKEN');

			}
		})
		.then(() => {
			let tokenaccountuuid = tokenaccount.getTokenAccountUUID();
			
			dispatch(importERC20TokenSuccess(tokenname, tokenaccountuuid, true));
			dispatch(importERC20TokenPending(false));
			
			if (callback)
				callback(null, tokenaccountuuid);
			
			return tokenaccountuuid;
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
			else if (err == 'ERR_CARD_NOT_FOUND') {
				dispatch({type: 'RESET_CARD'});
				
			}
			else if (err == 'ERR_CARD_LOCKED') {
				dispatch({type: 'LOCK_CARD'});
			}
			
			dispatch(importERC20TokenError(err));
			dispatch(importERC20TokenSuccess(null, null, false));
			dispatch(importERC20TokenPending(false));

			
			if (callback)
				callback(err, null);
		});
		
	};
};



//actions
function modifyERC20TokenPending(ispending) {
	return {
		type: 'MODIFY_ERC20_TOKEN_PENDING',
		pending: ispending
	}
};

function modifyERC20TokenSuccess(tokenname, tokenuuid, success) {
	return {
		type: 'MODIFY_ERC20_TOKEN_SUCCESS',
		tokenname: tokenname,
		tokenuuid: tokenuuid,
		success: success
	}
};

function modifyERC20TokenError(error) {
	return {
		type: 'MODIFY_ERC20_TOKEN_ERROR',
		error: error
	}
};


//action creators
export const doModifyERC20Token = (mvcmodule, sessionuuid, walletuuid, carduuid, tokenaccountuuid, tokeninfo, callback) => {
	console.log('doModifyERC20Token called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let password = null; // only client card for the moment
	let address = null; // let wallet generate and store a private key
	
	let tokenname = tokeninfo.name;
	
	let session;
	let wallet;
	let walletname;
	let card;
	let tokenaccount;
	
	return dispatch => {
		dispatch(modifyERC20TokenPending(true));
		dispatch(modifyERC20TokenSuccess(tokenname, tokenaccountuuid, false));
		dispatch(modifyERC20TokenError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.getWalletFromUUID(session, walletuuid)
		})
		.then((res) => {
			wallet = res;
			walletname = wallet.getName();
			
			return wallet.getCardFromUUID(carduuid);
		})
		.then((res) => {
			card = res;
			
			if (card.isLocked()) {
				var promise_isunlocked = card.unlock();
			}
			else {
				var promise_isunlocked = Pomise.resolve(true);
			}
			
			return promise_isunlocked;
		}) 
		.then((isunlocked) => {
			
			if (isunlocked) {
				return card.modifyTokenAccount(tokenaccountuuid, tokeninfo);
			}
			else {
				throw new Error('ERR_CARD_LOCKED');
			}
			
		})
		.then((res) => {
			tokenaccount = res;
			
			dispatch(modifyERC20TokenSuccess(tokenname, tokenaccountuuid, true));
			dispatch(modifyERC20TokenPending(false));
			
			if (callback)
				callback(null, tokenaccountuuid);
			
			return tokenaccountuuid;
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
			else if (err == 'ERR_CARD_NOT_FOUND') {
				dispatch({type: 'RESET_CARD'});
				
			}
			else if (err == 'ERR_CARD_LOCKED') {
				dispatch({type: 'LOCK_CARD'});
			}
			
			dispatch(modifyERC20TokenError(err));
			dispatch(modifyERC20TokenSuccess(tokenname, tokenaccountuuid, false));
			dispatch(modifyERC20TokenPending(false));

			
			if (callback)
				callback(err, null);
		});
		
	};
};


//actions
export function setTransferERC20TokenPending(pending) {
	return {
		type: 'TRANSFER_ERC20_TOKEN_PENDING',
		pending: pending
	};
};

export function setTransferERC20TokenSuccess(tokenuuid, tocontactuuid, amount, success) {
	return {
		type: 'TRANSFER_ERC20_TOKEN_SUCCESS',
		tokenuuid: tokenuuid,
		tocontactuuid: tocontactuuid,
		amount: amount,
		success: success
	};
};

export function setTransferERC20TokenError(error) {
	return {
		type: 'TRANSFER_ERC20_TOKEN_ERROR',
		error: error
	};
};

//action creator
export const doTransferERC20Token = (mvcmodule, sessionuuid, walletuuid, carduuid, tokenuuid, tocontactuuid, amount, callback) => {
	console.log('doTransferERC20Token called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();

	let session;
	
	let wallet;
	let walletname;
	
	let card;
	let cardname;
	
	let tokenaccount;
	let contact;
	
	return dispatch => {
		dispatch(setTransferERC20TokenPending(true));
		dispatch(setTransferERC20TokenSuccess(tokenuuid, tocontactuuid, amount, false));
		dispatch(setTransferERC20TokenError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.getWalletFromUUID(session, walletuuid)
		})
		.then((wllt) => {
			wallet = wllt;
			walletname = wallet.getName();
			
			return wallet.getCardFromUUID(carduuid);
		})
		.then((res) => {
			card = res;
			cardname = card.getLabel();
			
			if (card.isLocked()) {
				var promise_isunlocked = card.unlock();
			}
			else {
				var promise_isunlocked = Pomise.resolve(true);
			}
			
			return promise_isunlocked;
		}) 
		.then((isunlocked) => {
			
			if (isunlocked) {
				return card.getTokenAccountFromUUID(tokenuuid);
			}
			else {
				dispatch(setTransferERC20TokenError('could not open card ' + cardname));
				dispatch(setTransferERC20TokenSuccess(tokenuuid, tocontactuuid, amount, false));
				dispatch(setTransferERC20TokenPending(false));
				
				throw new Error('ERR_CARD_LOCKED');
			}
			
		})
		.then((res) => {
			tokenaccount = res;
			
			// get contact object
			return mobilecontrollers.getContactFromUUID(session, tocontactuuid);
		}) 
		.then((res) => {
			contact = res;
			
			// transfer
			return tokenaccount.transferTo(contact, amount);
		}) 
		.then(() => {
			dispatch(setTransferERC20TokenSuccess(tokenuuid, tocontactuuid, amount, true));
			dispatch(setTransferERC20TokenPending(false));
			
			if (callback)
				callback(null, amount);
			
			return amount;
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
			else if (err == 'ERR_CARD_NOT_FOUND') {
				dispatch({type: 'RESET_CARD'});
				
			}
			else if (err == 'ERR_CARD_LOCKED') {
				dispatch({type: 'LOCK_CARD'});
			}
			
			dispatch(setTransferERC20TokenError(err));
			dispatch(setTransferERC20TokenSuccess(tokenuuid, tocontactuuid, amount, false));
			dispatch(setTransferERC20TokenPending(false));
			
			if (callback)
				callback(err, null);
		});
		
	};
};



