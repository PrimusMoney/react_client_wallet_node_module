// actions
function fetchCardListPending(ispending) {
	return {
		type: 'FETCH_CARDS_PENDING',
		pending: ispending
	};
};

function fetchCardListSuccess(success, cardarray) {
	return {
		type: 'FETCH_CARDS_SUCCESS',
		success: success,
		array: cardarray
	};
};

function fetchCardListError(error) {
	return {
		type: 'FETCH_CARDS_ERROR',
		error: error
	};
};

// action creator
export const doFetchCards = (mvcmodule, sessionuuid, walletuuid, callback) => {
	console.log('doFetchCards called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();

	let session;
	let walletname;
	
	return dispatch => {
		dispatch(fetchCardListPending(true));
		dispatch(fetchCardListSuccess(false, []));
		dispatch(fetchCardListError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			return mobilecontrollers.getWalletFromUUID(session, walletuuid)
		})
		.then((wallet) => {
			walletname = wallet.getName();
			
			return wallet.getCardList(true);
		})
		.then((cardarray) => {
	
			var cards = [];

			if (cardarray) {
				
				for (var i = 0; i < cardarray.length; i++) {
					var card = {
							uuid: cardarray[i].getCardUUID(),
							authname: cardarray[i].getAuthName(),
							name: cardarray[i].getLabel(),
							address: cardarray[i].getAddress(),
							label: cardarray[i].getLabel(),
							type: cardarray[i].getCardType(),
							schemeuuid: cardarray[i].getScheme().getSchemeUUID(),
						};
					
					cards.push(card);
				}
				
				dispatch(fetchCardListSuccess(true, cards));
				dispatch(fetchCardListPending(false));
				
				if (callback)
					callback(null, cards);
				
				return cards;
			}
			else {
				dispatch(fetchCardListError('could not find list of cards for wallet ' + walletname));
			 	dispatch(fetchCardListSuccess(false, []));
				dispatch(fetchCardListPending(false));
				
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

			
			dispatch(fetchCardListError(err));
			dispatch(fetchCardListPending(false));
			
			if (callback)
				callback(err, null);
		});
		
	};
};

//actions
export function resetCards() {
	return {
		type: 'RESET_CARDS'
	};
};

//action creator
export const doResetCards = () => {
	return dispatch => {
		dispatch(resetCards());
	};
};



//actions
function setOpenCardPending(pending) {
	return {
		type: 'OPEN_CARD_PENDING',
		pending: pending
	};
};

function setOpenCardSuccess(carduuid, cardname, success) {
	return {
		type: 'OPEN_CARD_SUCCESS',
		cardname: cardname,
		carduuid: carduuid,
		success: success
	};
};

function setOpenCardError(error) {
	return {
		type: 'OPEN_CARD_ERROR',
		error: error
	};
};

//action creator
export const doOpenCard = (mvcmodule, sessionuuid, walletuuid, carduuid, callback) => {
	console.log('doOpenCard called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();

	let session;
	
	let wallet;
	let walletname;
	
	let cardname = carduuid;
	let card;
	
	return dispatch => {
		dispatch(setOpenCardPending(true));
		dispatch(setOpenCardSuccess(carduuid, cardname));
		dispatch(setOpenCardError(null));
		
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
				dispatch(setOpenCardSuccess(carduuid, cardname, true));
				dispatch(setOpenCardPending(false));
				
				if (callback)
					callback(null, true);
				
				return isunlocked;
			}
			else {
				dispatch(setOpenCardError('could not open card ' + cardname));
				dispatch(setOpenCardSuccess(carduuid, cardname, false));
				dispatch(setOpenCardPending(false));
				
				throw new Error('ERR_CARD_LOCKED');
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
			
			dispatch(setOpenCardError(err));
			dispatch(setOpenCardSuccess(carduuid, cardname, false));
			dispatch(setOpenCardPending(false));
			
			if (callback)
				callback(err, null);
		});
		
	};
};

//actions
export function resetCard() {
	return {
		type: 'RESET_CARD'
	};
};

//action creator
export const doResetCard = () => {
	return dispatch => {
		dispatch(resetCard());
		
		// reset erc20 token
		dispatch({type: 'RESET_ERC20_TOKEN'});
		
		// reset erc20 token list
		dispatch({type: 'RESET_ERC20_TOKENS'});

	};
};

//actions
export function lockCard() {
	return {
		type: 'LOCK_CARD'
	};
};

//action creator
export const doLockCard = () => {
	return dispatch => {
		dispatch(lockCard());
	};
};



//actions
function createCardPending(ispending) {
	return {
		type: 'CREATE_CARD_PENDING',
		pending: ispending
	}
};

function createCardSuccess(cardname, carduuid, success) {
	return {
		type: 'CREATE_CARD_SUCCESS',
		cardname: cardname,
		carduuid: carduuid,
		success: success
	}
};

function createCardError(error) {
	return {
		type: 'CREATE_CARD_ERROR',
		error: error
	}
};


// action creators
export const doCreateCard = (mvcmodule, sessionuuid, walletuuid, schemeuuid, cardinfo, callback) => {
	console.log('doCreateCard called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let cardname = (cardinfo.name ? cardinfo.name : (cardinfo.toString().length ? cardinfo.toString() : ''));
	let authname = (cardinfo.authname ? cardinfo.authname : cardname);
	let password = cardinfo.password;
	let address = cardinfo.address; // when null, lets wallet generate and store a private key
	
	let session;
	let scheme;
	let wallet
	let walletname;
	let card;
	
	return dispatch => {
		dispatch(createCardPending(true));
		dispatch(createCardSuccess(null));
		dispatch(createCardError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			return mobilecontrollers.getSchemeFromUUID(session, schemeuuid);
		})
		.then((res) => {
			scheme = res;
			return mobilecontrollers.getWalletFromUUID(session, walletuuid);
		})
		.then((res) => {
			wallet = res;
			walletname = wallet.getName();
			
			return wallet.createCard(scheme, authname, password, address);
		})
		.then((crd) => {
			card = crd;
			
			if (card) {
				// set label
				card.setLabel(cardname);
				
				return card.save();
			}
			else {
				throw new Error('ERR_COULD_NOT_CREATE_CARD');
			}
		})
		.then(() => {
			var carduuid = card.getCardUUID();
			
			dispatch(createCardSuccess(cardname, carduuid, true));
			dispatch(createCardPending(false));
			
			if (callback)
				callback(null, carduuid);
			
			return carduuid;
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
			
			dispatch(createCardError(err));
			dispatch(createCardSuccess(null, false));
			dispatch(createCardPending(false));

			
			if (callback)
				callback(err, null);
		});
		
	};
};

//actions
function importCardPending(ispending) {
	return {
		type: 'IMPORT_CARD_PENDING',
		pending: ispending
	}
};

function importCardSuccess(cardname, carduuid, success) {
	return {
		type: 'IMPORT_CARD_SUCCESS',
		cardname: cardname,
		carduuid: carduuid,
		success: success
	}
};

function importCardError(error) {
	return {
		type: 'IMPORT_CARD_ERROR',
		error: error
	}
};


// action creators
export const doImportCard = (mvcmodule, sessionuuid, walletuuid, cardname, address, configurl, authname, password, options, callback) => {
	console.log('doImportCard called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let session;
	let scheme;
	let wallet
	let walletname;
	
	let card;
	
	return dispatch => {
		dispatch(importCardPending(true));
		dispatch(importCardSuccess(null));
		dispatch(importCardError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			return mobilecontrollers.getWalletFromUUID(session, walletuuid);
		})
		.then((res) => {
			wallet = res;
			walletname = wallet.getName();
			
			return wallet.importCard(address, configurl, authname, password, options);
		})
		.then((res) => {
			card = res;
			
			if (card) {
				card.setLabel(cardname);
				
				return card.save();
			}
			else {
				throw new Error('ERR_COULD_NOT_IMPORT_CARD');
			}
		})
		.then(() => {
			var carduuid = card.getCardUUID();
			
			dispatch(importCardSuccess(cardname, carduuid, true));
			dispatch(importCardPending(false));
			
			if (callback)
				callback(null, carduuid);
			
			return carduuid;
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
			
			dispatch(importCardError(err));
			dispatch(importCardSuccess(null, false));
			dispatch(importCardPending(false));

			
			if (callback)
				callback(err, null);
		});
		
	};
};


//actions
function modifyCardPending(ispending) {
	return {
		type: 'MODIFY_CARD_PENDING',
		pending: ispending
	}
};

function modifyCardSuccess(cardname, carduuid, success) {
	return {
		type: 'MODIFY_CARD_SUCCESS',
		cardname: cardname,
		carduuid: carduuid,
		success: success
	}
};

function modifyCardError(error) {
	return {
		type: 'MODIFY_CARD_ERROR',
		error: error
	}
};


// action creators
export const doModifyCard = (mvcmodule, sessionuuid, walletuuid, carduuid, cardinfo, callback) => {
	console.log('doModifyCard called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let cardname = cardinfo.cardname;
	
	let session;
	let scheme;
	let wallet
	let walletname;
	
	let card;
	
	return dispatch => {
		dispatch(modifyCardPending(true));
		dispatch(modifyCardSuccess(cardname, carduuid, false));
		dispatch(modifyCardError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			return mobilecontrollers.getWalletFromUUID(session, walletuuid);
		})
		.then((res) => {
			wallet = res;
			walletname = wallet.getName();
			
			return wallet.modifyCard(carduuid, cardinfo);
		})
		.then((res) => {
			card = res;
			
			var carduuid = card.getCardUUID();
			
			dispatch(modifyCardSuccess(cardname, carduuid, true));
			dispatch(modifyCardPending(false));
			
			if (callback)
				callback(null, carduuid);
			
			return carduuid;
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
			
			dispatch(modifyCardError(err));
			dispatch(modifyCardSuccess(cardname, carduuid, false));
			dispatch(modifyCardPending(false));

			
			if (callback)
				callback(err, null);
		});
		
	};
};


