// actions
export function resetSession() {
	return {
		type: 'RESET_SESSION'
	};
};

//action creator
export const doResetSession = () => {
	return dispatch => {
		dispatch(resetSession());
	};
};



// actions
export function setSessionCreatePending(pending) {
	return {
		type: 'SET_SESSION_CREATE_PENDING',
		pending: pending
	};
};

export function setSessionCreateSuccess(sessionuuid) {
	return {
		type: 'SET_SESSION_CREATE_SUCCESS',
		sessionuuid: sessionuuid,
		success: true
	};
};

export function setSessionCreateError(error) {
	return {
		type: 'SET_SESSION_CREATE_ERROR',
		sessionuuid: null,
		error: error
	}
}


// action creators
export const doFetchBlankSession = (mvcmodule, callback) => {
	console.log('doFetchBlankSession called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	return dispatch => {
		dispatch(setSessionCreatePending(true));
		dispatch(setSessionCreateSuccess(null));
		dispatch(setSessionCreateError(null));
		
		return new Promise((resolve, reject) => {
			let session = mobilecontrollers.createBlankSessionObject();
			
			if (!session) reject('could not create blank session'); else resolve(session);
		})
		.then((session) => {
			var schemeconfig = mobilecontrollers.getDefaultSchemeConfig(1);
			
			return mobilecontrollers.setSessionNetworkConfig(session, schemeconfig);
		})
		.then((session) => {
			if (session) {
				var sessionuuid = session.getSessionUUID();
				
				dispatch(setSessionCreateSuccess(sessionuuid));
				dispatch(setSessionCreatePending(false));
			
				if (callback)
					callback(null, session);

				return session;
			}
			else {
				dispatch(setSessionCreateError('could not create a blank session'));
				dispatch(setSessionCreatePending(false));
			
				throw new Error('ERR_COULD_NOT_FETCH_BLANK_SESSION');
			}
			
		})
		.catch(err => {
			dispatch(setSessionCreateError(err));
			dispatch(setSessionCreatePending(false));
			
			if (callback)
				callback(err, false);
		});
		 
	};
};

//actions
export function setSessionCheckPending(pending) {
	return {
		type: 'SET_SESSION_CHECK_PENDING',
		pending: pending
	};
};

export function setSessionCheckSuccess(sessionuuid) {
	return {
		type: 'SET_SESSION_CHECK_SUCCESS',
		sessionuuid: sessionuuid,
		success: true
	};
};

export function setSessionCheckError(error) {
	return {
		type: 'SET_SESSION_CHECK_ERROR',
		sessionuuid: null,
		error: error
	}
};

//action creator
export const doCheckSession = (mvcmodule, sessionuuid, callback) => {
	console.log('doCheckSession called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let session;

	return dispatch => {
		dispatch(setSessionCheckPending(true));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			if (session) {
				var sessionuuid = session.getSessionUUID();
				
				dispatch(setSessionCheckSuccess(sessionuuid));
				dispatch(setSessionCheckPending(false));
				
				if (callback)
					callback(null, true);

				return true;
			}
			else {
				dispatch(setSessionCheckError('could not find session with uuid ' + sessionuuid));
				dispatch(setSessionCheckPending(false));
				
				// clean everything
				dispatch(resetSession());
			
				throw new Error('ERR_SESSION_NOT_FOUND');
			}
			
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}
			
			dispatch(setSessionCheckError(err));
			dispatch(setSessionCheckPending(false));
			
			if (callback)
				callback(err, false);
		});
		
	};
};
