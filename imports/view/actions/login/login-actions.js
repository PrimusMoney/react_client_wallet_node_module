// actions
export function logoutSession() {
	return {
		type: 'LOGOUT_SESSION'
	};
};

//action creator
export const doLogoutSession = () => {
	return dispatch => {
		dispatch(logoutSession());
	};
};


// actions
export function setLoginPending(pending) {
	return {
		type: 'SET_LOGIN_PENDING',
		pending: pending
	};
};

export function setLoginSuccess(sessionuuid, username, success) {
	return {
		type: 'SET_LOGIN_SUCCESS',
		sessionuuid: sessionuuid,
		username: username,
		success: success
	};
};

export function setLoginError(error) {
	return {
		type: 'SET_LOGIN_ERROR',
		error: error
};
};

// action creator
export const doLogin = (mvcmodule, sessionuuid, username, password, callback) => {
	console.log('doLogin called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();

	let session;

	return dispatch => {
		dispatch(setLoginPending(true));
		dispatch(setLoginSuccess(sessionuuid, username, false));
		dispatch(setLoginError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.authenticate(session, username, password)
		})
		.then((connected) => {
			
			if (connected) {
				dispatch(setLoginSuccess(sessionuuid, username, true));
				dispatch(setLoginPending(false));
				
				if (callback)
					callback(null, true);

				return connected;
			}
			else {
				dispatch(setLoginError('could not proceed with provided credentials'));
				dispatch(setLoginSuccess(sessionuuid, username, false));
				dispatch(setLoginPending(false));
				
				throw new Error('ERR_WRONG_CREDENTIALS');
			}
			
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}			
			else if (err.message == 'ERR_SESSION_NOT_AUTHENTICATED') {
				dispatch({type: 'LOGOUT_SESSION'});
			}
			
			dispatch(setLoginError(err));
			dispatch(setLoginPending(false));
			
			if (callback)
				callback(err, false);
		});
		
	};
};


//actions
export function checkLoginPending(pending) {
	return {
		type: 'CHECK_LOGIN_PENDING',
		pending: pending
	};
};

export function checkLoginSuccess(sessionuuid, check, date) {
	return {
		type: 'CHECK_LOGIN_SUCCESS',
		sessionuuid: sessionuuid,
		check: check,
		checkedon: date
	};
};

export function checkLoginError(error) {
	return {
		type: 'CHECK_LOGIN_ERROR',
		error: error
	}
};


// action creator
export const doCheckLoggedIn = (mvcmodule, sessionuuid, callback) => {
	console.log('doCheckLoggedIn called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let session;

	return dispatch => {
		dispatch(checkLoginPending(true));
		dispatch(checkLoginError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.isSessionAnonymous(session)
		})
		.then((anonymous) => {
			
			var now = Date.now();
			
			if (anonymous) {
				dispatch(checkLoginSuccess(sessionuuid, false, now));
				dispatch(checkLoginPending(false));
				
				throw new Error('ERR_SESSION_NOT_AUTHENTICATED');
			}
			else {
				dispatch(checkLoginSuccess(sessionuuid, true, now));
				dispatch(checkLoginPending(false));
				
				if (callback)
					callback(null, true);
			}
			
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}			
			else if (err.message == 'ERR_SESSION_NOT_AUTHENTICATED') {
				dispatch({type: 'LOGOUT_SESSION'});
			}
			
			dispatch(checkLoginError(err));
			dispatch(checkLoginPending(false));
			
			if (callback)
				callback(err, false);
		});
		
	};
};

