// actions
function fetchSchemeListPending(ispending) {
	return {
		type: 'FETCH_SCHEMES_PENDING',
		pending: ispending
	}
};

function fetchSchemeListSuccess(array, success) {
	return {
		type: 'FETCH_SCHEMES_SUCCESS',
		array: array,
		success: success
	}
};

function fetchSchemeListError(error) {
	return {
		type: 'FETCH_SCHEMES_ERROR',
		error: error
	}
};



//action creators
export const doFetchSchemeList = (mvcmodule, sessionuuid, callback) => {
	console.log('doFetchSchemeList called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let session;

	return dispatch => {
		dispatch(fetchSchemeListPending(true));
		dispatch(fetchSchemeListSuccess(null));
		dispatch(fetchSchemeListError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.getSchemeList(session, true)
		})
		.then((schemearray) => {
			var schemes = [];
			
			if (schemearray) {
				for (var i = 0; i < schemearray.length; i++) {
					var scheme = {
							uuid: schemearray[i].getSchemeUUID(),
							name: schemearray[i].getName(),
							label: schemearray[i].getLabel(),
							type: schemearray[i].getSchemeType(),
					};
					schemes.push(scheme);
				}
				
				dispatch(fetchSchemeListSuccess(schemes, true));
				dispatch(fetchSchemeListPending(false));
				
				if (callback)
					callback(null, schemes);
				
				return schemes;
			}
			else {
				dispatch(fetchSchemeListError('no list returned'));
				dispatch(fetchSchemeListSuccess(schemes, false));
				dispatch(fetchSchemeListPending(false));
				
				throw new Error('ERR_NO_RESULT');
			}
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}			
			
			dispatch(fetchSchemeListError(err));
			dispatch(fetchSchemeListSuccess([], false));
			dispatch(fetchSchemeListPending(false));
			
			if (callback)
				callback(err, null);
		});
		
	};
};



//actions
export function setOpenSchemePending(pending) {
	return {
		type: 'OPEN_SCHEME_PENDING',
		pending: pending
	};
};

export function setOpenSchemeSuccess(schemeuuid, success) {
	return {
		type: 'OPEN_SCHEME_SUCCESS',
		schemeuuid: schemeuuid,
		success: success
	};
};

export function setOpenSchemeError(error) {
	return {
		type: 'OPEN_SCHEME_ERROR',
		error: error
	};
};

//action creator
export const doOpenScheme = (mvcmodule, sessionuuid, schemeuuid, callback) => {
	console.log('doOpenScheme called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();

	let session;
	let scheme;
	
	return dispatch => {
		dispatch(setOpenSchemePending(true));
		dispatch(setOpenSchemeSuccess(schemeuuid, false));
		dispatch(setOpenSchemeError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.getSchemeFromUUID(session, schemeuuid);
		})
		.then((res) => {
			scheme = res;
			
			if (scheme) {
				dispatch(setOpenSchemeSuccess(schemeuuid, true));
				dispatch(setOpenSchemePending(false));
				
				if (callback)
					callback(null, true);
				
				return scheme;
			}
			else {
				dispatch(setOpenSchemeError('could not open scheme ' + schemeuuid));
				dispatch(setOpenSchemeSuccess(schemeuuid, false));
				dispatch(setOpenSchemePending(false));
				
				throw new Error('ERR_COULD_NOT_OPEN_SCHEME');
			}
			
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}			
			
			dispatch(setOpenSchemeError(err));
			dispatch(setOpenSchemeSuccess(schemeuuid, false));
			dispatch(setOpenSchemePending(false));
			
			if (callback)
				callback(err, null);
		});
		
	};
};




//actions
function createSchemePending(ispending) {
	return {
		type: 'CREATE_SCHEME_PENDING',
		pending: ispending
	}
};

function createSchemeSuccess(schemeuuid, success) {
	return {
		type: 'CREATE_SCHEME_SUCCESS',
		schemeuuid: schemeuuid,
		success: success
	}
};

function createSchemeError(error) {
	return {
		type: 'CREATE_SCHEME_ERROR',
		error: error
	}
};


// action creators
export const doCreateScheme = (mvcmodule, sessionuuid, schemename, web3providerurl, callback) => {
	console.log('doCreateScheme called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let session;
	
	var localschemeconfig;
	var scheme;

	
	return dispatch => {
		dispatch(createSchemePending(true));
		dispatch(createSchemeSuccess(null));
		dispatch(createSchemeError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.createLocalSchemeConfig(session, web3providerurl);
		})
		.then((schmeconfig) => {
			localschemeconfig = schmeconfig;
			
			localschemeconfig.name = schemename;
			localschemeconfig.label = schemename;

			return mobilecontrollers.createScheme(session, localschemeconfig);
		})
		.then((schme) => {
			scheme = schme;
			
			if (scheme) {
				var schemeuuid = scheme.getSchemeUUID();
				
				dispatch(createSchemeSuccess(schemeuuid, true));
				dispatch(createSchemePending(false));
				
				if (callback)
					callback(null, scheme);
				
				return scheme;
			}
			else {
				dispatch(createSchemeError('could not create scheme ' + schemename));
				dispatch(createSchemeSuccess(null, false));
				dispatch(createSchemePending(false));
				
				throw new Error('ERR_COULD_NOT_CREATE_SCHEME');
			}
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}			
			
			dispatch(createSchemeError(err));
			dispatch(createSchemeSuccess(null, false));
			dispatch(createSchemePending(false));

			
			if (callback)
				callback(err, null);
		});
		
	};
};


//actions
function importSchemePending(ispending) {
	return {
		type: 'IMPORT_SCHEME_PENDING',
		pending: ispending
	}
};

function importSchemeSuccess(schemeuuid, success) {
	return {
		type: 'IMPORT_SCHEME_SUCCESS',
		schemeuuid: schemeuuid,
		success: success
	}
};

function importSchemeError(error) {
	return {
		type: 'IMPORT_SCHEME_ERROR',
		error: error
	}
};


// action creators
export const doImportScheme = (mvcmodule, sessionuuid, configurl, schemename, callback) => {
	console.log('doImportScheme called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let session;
	let scheme;
	
	return dispatch => {
		dispatch(importSchemePending(true));
		dispatch(importSchemeSuccess(null));
		dispatch(importSchemeError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.importScheme(session, configurl);
		})
		.then((schm) => {
			scheme = schm;
			
			if (scheme) {
				scheme.setLabel(schemename);
				
				return scheme.save;
			}
			else {
				throw new Error('ERR_COULD_NOT_IMPORT_SCHEME');
			}
		})
		.then(() => {
			var schemeuuid = scheme.getSchemeUUID();
			
			dispatch(importSchemeSuccess(schemeuuid, true));
			dispatch(importSchemePending(false));
			
			if (callback)
				callback(null, schemeuuid);
			
			return schemeuuid;
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}
			
			dispatch(importSchemeError(err));
			dispatch(importSchemeSuccess(null, false));
			dispatch(importSchemePending(false));

			
			if (callback)
				callback(err, null);
		});
		
	};
};

//actions
export function resetScheme() {
	return {
		type: 'RESET_SCHEME'
	};
};

//action creator
export const doResetScheme = () => {
	return dispatch => {
		dispatch(resetScheme());
	};
};

//actions
function modifySchemePending(ispending) {
	return {
		type: 'MODIFY_SCHEME_PENDING',
		pending: ispending
	}
};

function modifySchemeSuccess(schemeuuid, success) {
	return {
		type: 'MODIFY_SCHEME_SUCCESS',
		schemeuuid: schemeuuid,
		success: success
	}
};

function modifySchemeError(error) {
	return {
		type: 'MODIFY_SCHEME_ERROR',
		error: error
	}
};


// action creators
export const doModifyScheme = (mvcmodule, sessionuuid, schemeuuid, schemeinfo, callback) => {
	console.log('doModifyScheme called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let schemename = schemeinfo.name;
	let session;
	let scheme;
	
	return dispatch => {
		dispatch(modifySchemePending(true));
		dispatch(modifySchemeSuccess(schemeuuid, false));
		dispatch(modifySchemeError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;

			return mobilecontrollers.modifyScheme(session, schemeuuid, schemeinfo)
		})
		.then((schm) => {
			scheme = schm;
			
			if (scheme) {
				return scheme;
			}
			else {
				throw new Error('ERR_COULD_NOT_MODIFY_SCHEME');
			}
		})
		.then(() => {
			var schemeuuid = scheme.getSchemeUUID();
			
			dispatch(modifySchemeSuccess(schemeuuid, true));
			dispatch(modifySchemePending(false));
			
			if (callback)
				callback(null, schemeuuid);
			
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}			
			
			dispatch(modifySchemeError(err));
			dispatch(modifySchemeSuccess(null, false));
			dispatch(modifySchemePending(false));

			
			if (callback)
				callback(err, null);
		});
		
	};
};



