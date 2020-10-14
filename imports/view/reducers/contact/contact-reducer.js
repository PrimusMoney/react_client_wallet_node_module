const initialState = {
	fetchpending: false,
	fetchsuccess: false,
	array: [],
	openpending: false,
	opensuccess: false,
	error: null
}

const contactsReducer = (state = initialState, action) => {
	switch(action.type) {
		case 'FETCH_CONTACTS_PENDING': 
			return Object.assign({}, state, {
				fetchpending: action.pending
			});
		case 'FETCH_CONTACTS_SUCCESS':
			return Object.assign({}, state, {
				fetchsuccess: action.success,
				array: action.array
			});
		case 'FETCH_CONTACTS_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
		
		
		case 'OPEN_CONTACT_PENDING': 
			return Object.assign({}, state, {
				openpending: action.pending
			});
		case 'OPEN_CONTACT_SUCCESS':
			return Object.assign({}, state, {
				opensuccess: action.success,
				contactuuid: action.contactuuid
			});
		case 'OPEN_CONTACT_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
			
			
		case 'CREATE_CONTACT_PENDING': 
			return Object.assign({}, state, {
				createpending: action.pending
			});
		case 'CREATE_CONTACT_SUCCESS':
			return Object.assign({}, state, {
				createsuccess: action.success,
				contactuuid: action.contactuuid
			});
		case 'CREATE_CONTACT_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
			
			
		case 'IMPORT_CONTACT_PENDING': 
			return Object.assign({}, state, {
				importpending: action.pending
			});
		case 'IMPORT_CONTACT_SUCCESS':
			return Object.assign({}, state, {
				importsuccess: action.success,
				contactuuid: action.contactuuid
			});
		case 'IMPORT_CONTACT_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});

			
		case 'MODIFY_CONTACT_PENDING': 
			return Object.assign({}, state, {
				modifypending: action.pending
			});
		case 'MODIFY_CONTACT_SUCCESS':
			return Object.assign({}, state, {
				modifysuccess: action.success,
				contactuuid: action.contactuuid
			});
		case 'MODIFY_CONTACT_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
			
			
		case 'RESET_CONTACT': 
			return Object.assign({}, state, {
				contactuuid: null,
				opensuccess: false,
				openpending: false,
			});
			
		default: 
			return state;
	}
}

export default contactsReducer;