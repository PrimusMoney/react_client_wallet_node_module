// actions
function fetchContactListPending(ispending) {
	return {
		type: 'FETCH_CONTACTS_PENDING',
		pending: ispending
	}
};

function fetchContactListSuccess(array, success) {
	return {
		type: 'FETCH_CONTACTS_SUCCESS',
		array: array,
		success: success
	}
};

function fetchContactListError(error) {
	return {
		type: 'FETCH_CONTACTS_ERROR',
		error: error
	}
};



//action creators
export const doFetchContactList = (mvcmodule, sessionuuid, callback) => {
	console.log('doFetchContactList called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let session;

	return dispatch => {
		dispatch(fetchContactListPending(true));
		dispatch(fetchContactListSuccess(null));
		dispatch(fetchContactListError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.getContactList(session, true)
		})
		.then((contactarray) => {
			var contacts = [];
			
			if (contactarray) {
				for (var i = 0; i < contactarray.length; i++) {
					var contact = {
							uuid: contactarray[i].getContactUUID(),
							name: contactarray[i].getName(),
							label: contactarray[i].getLabel(),
							type: contactarray[i].getContactType(),
					};
					contacts.push(contact);
				}
				
				dispatch(fetchContactListSuccess(contacts, true));
				dispatch(fetchContactListPending(false));
				
				if (callback)
					callback(null, contacts);
				
				return contacts;
			}
			else {
				dispatch(fetchContactListError('no contact list returned'));
				dispatch(fetchContactListSuccess(contacts, false));
				dispatch(fetchContactListPending(false));
				
				throw new Error('ERR_NO_RESULT');
			}
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}			
			
			dispatch(fetchContactListError(err));
			dispatch(fetchContactListSuccess([], false));
			dispatch(fetchContactListPending(false));
			
			if (callback)
				callback(err, null);
		});
		
	};
};



//actions
export function setOpenContactPending(pending) {
	return {
		type: 'OPEN_CONTACT_PENDING',
		pending: pending
	};
};

export function setOpenContactSuccess(contactuuid, success) {
	return {
		type: 'OPEN_CONTACT_SUCCESS',
		contactuuid: contactuuid,
		success: success
	};
};

export function setOpenContactError(error) {
	return {
		type: 'OPEN_CONTACT_ERROR',
		error: error
	};
};

//action creator
export const doOpenContact = (mvcmodule, sessionuuid, contactuuid, callback) => {
	console.log('doOpenContact called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();

	let session;
	let contact;
	
	return dispatch => {
		dispatch(setOpenContactPending(true));
		dispatch(setOpenContactSuccess(contactuuid, false));
		dispatch(setOpenContactError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.getContactFromUUID(session, contactuuid);
		})
		.then((res) => {
			contact = res;
			
			if (contact) {
				dispatch(setOpenContactSuccess(contactuuid, true));
				dispatch(setOpenContactPending(false));
				
				if (callback)
					callback(null, true);
				
				return contact;
			}
			else {
				throw new Error('ERR_COULD_NOT_OPEN_CONTACT');
			}
			
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}			
			
			dispatch(setOpenContactError(err));
			dispatch(setOpenContactSuccess(contactuuid, false));
			dispatch(setOpenContactPending(false));
			
			if (callback)
				callback(err, null);
		});
		
	};
};




//actions
function createContactPending(ispending) {
	return {
		type: 'CREATE_CONTACT_PENDING',
		pending: ispending
	}
};

function createContactSuccess(contactuuid, success) {
	return {
		type: 'CREATE_CONTACT_SUCCESS',
		contactuuid: contactuuid,
		success: success
	}
};

function createContactError(error) {
	return {
		type: 'CREATE_CONTACT_ERROR',
		error: error
	}
};


//action creators
export const doCreateContact = (mvcmodule, sessionuuid, contactname, address, contactinfo, callback) => {
	console.log('doCreateContact called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let session;
	let contact

	
	return dispatch => {
		dispatch(createContactPending(true));
		dispatch(createContactSuccess(null));
		dispatch(createContactError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;

			return mobilecontrollers.createContact(session, contactname, address, contactinfo)
		})
		.then((ct) => {
			contact = ct
			
			if (contact) {
				var contactuuid = contact.getContactUUID();
				
				dispatch(createContactSuccess(contactuuid, true));
				dispatch(createContactPending(false));
				
				if (callback)
					callback(null, contactuuid);
				
				return contact;
			}
			else {
				dispatch(createContactError('could not create contact ' + contactname));
				dispatch(createContactSuccess(null, false));
				dispatch(createContactPending(false));
				
				throw new Error('ERR_COULD_NOT_CREATE_CONTACT');

			}
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}			
			
			dispatch(createContactError(err));
			dispatch(createContactSuccess(null, false));
			dispatch(createContactPending(false));

			
			if (callback)
				callback(err, null);
		});
		
	};
};


//actions
function importContactPending(ispending) {
	return {
		type: 'IMPORT_CONTACT_PENDING',
		pending: ispending
	}
};

function importContactSuccess(contactuuid, success) {
	return {
		type: 'IMPORT_CONTACT_SUCCESS',
		contactuuid: contactuuid,
		success: success
	}
};

function importContactError(error) {
	return {
		type: 'IMPORT_CONTACT_ERROR',
		error: error
	}
};


//action creators
export const doImportContact = (mvcmodule, sessionuuid, configurl, contactname, callback) => {
	console.log('doImportContact called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let session;
	let contact;
	
	return dispatch => {
		dispatch(importContactPending(true));
		dispatch(importContactSuccess(null));
		dispatch(importContactError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;
			
			return mobilecontrollers.importContact(session, configurl);
		})
		.then((ct) => {
			contact = ct;
			
			if (contact) {
				if (contactname) {
					contact.setLabel(contactname);
					
					return contact.save();
				}
				else {
					return contact;
				}
			}
			else {
				throw new Error('ERR_COULD_NOT_IMPORT_CONTACT');

			}
		})
		.then(() => {
			var contactuuid = contact.getContactUUID();
			
			dispatch(importContactSuccess(contactuuid, true));
			dispatch(importContactPending(false));
			
			if (callback)
				callback(null, contactuuid);
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}			
			
			dispatch(importContactError(err));
			dispatch(importContactSuccess(null, false));
			dispatch(importContactPending(false));

			
			if (callback)
				callback(err, null);
		});
		
	};
};


//actions
function modifyContactPending(ispending) {
	return {
		type: 'MODIFY_CONTACT_PENDING',
		pending: ispending
	}
};

function modifyContactSuccess(contactuuid, success) {
	return {
		type: 'MODIFY_CONTACT_SUCCESS',
		contactuuid: contactuuid,
		success: success
	}
};

function modifyContactError(error) {
	return {
		type: 'MODIFY_CONTACT_ERROR',
		error: error
	}
};


//action creators
export const doModifyContact = (mvcmodule, sessionuuid, contactuuid, contactinfo, callback) => {
	console.log('doModifyContact called');
	let mobilecontrollers = mvcmodule.getMobileControllersObject();
	
	let contactname = contactinfo.name;
	
	let session;
	let contact;

	
	return dispatch => {
		dispatch(modifyContactPending(true));
		dispatch(modifyContactSuccess(contactuuid, false));
		dispatch(modifyContactError(null));
		
		return mobilecontrollers.getSessionObject(sessionuuid)
		.then((sess) => {
			session = sess;

			return mobilecontrollers.modifyContact(session, contactuuid, contactinfo)
		})
		.then((ct) => {
			contact = ct;
			
			if (contact) {
				return contact;
			}
			else {
				throw new Error('ERR_COULD_NOT_MODIFY_CONTACT');

			}
		})
		.then(() => {
			var contactuuid = contact.getContactUUID();
			
			dispatch(modifyContactSuccess(contactuuid, true));
			dispatch(modifyContactPending(false));
			
			if (callback)
				callback(null, contactuuid);
			
			return contactuuid;
		})
		.catch(err => {
			if (err.message == 'ERR_SESSION_NOT_FOUND') {
				dispatch({type: 'RESET_SESSION'});
			}			
			
			dispatch(modifyContactError(err));
			dispatch(modifyContactSuccess(contactuuid, false));
			dispatch(modifyContactPending(false));

			
			if (callback)
				callback(err, null);
		});
		
	};
};



