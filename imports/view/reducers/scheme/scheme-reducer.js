const initialState = {
	pending: false,
	array: [],
	error: null,
	schemeuuid: null
}

const schemesReducer = (state = initialState, action) => {
	switch(action.type) {
		
		case 'FETCH_SCHEMES_PENDING': 
			return Object.assign({}, state, {
				fetchpending: action.pending
			});
		case 'FETCH_SCHEMES_SUCCESS':
			return Object.assign({}, state, {
				fetchsuccess: action.success,
				array: action.array
			});
		case 'FETCH_SCHEMES_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
			
			
		case 'OPEN_SCHEME_PENDING': 
			return Object.assign({}, state, {
				openpending: action.pending
			});
		case 'OPEN_SCHEME_SUCCESS':
			return Object.assign({}, state, {
				opensuccess: action.success,
				schemeuuid: action.schemeuuid
			});
		case 'OPEN_SCHEME_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
			
			
		case 'CREATE_SCHEME_PENDING': 
			return Object.assign({}, state, {
				createpending: action.pending
			});
		case 'CREATE_SCHEME_SUCCESS':
			return Object.assign({}, state, {
				createsuccess: action.success,
				schemeuuid: action.schemeuuid
			});
		case 'CREATE_SCHEME_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
			
			
		case 'IMPORT_SCHEME_PENDING': 
			return Object.assign({}, state, {
				importpending: action.pending
			});
		case 'IMPORT_SCHEME_SUCCESS':
			return Object.assign({}, state, {
				importsuccess: action.success,
				schemeuuid: action.schemeuuid
			});
		case 'IMPORT_SCHEME_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
			
			
		case 'MODIFY_SCHEME_PENDING': 
			return Object.assign({}, state, {
				modifypending: action.pending
			});
		case 'MODIFY_SCHEME_SUCCESS':
			return Object.assign({}, state, {
				modifysuccess: action.success,
				schemeuuid: action.schemeuuid
			});
		case 'MODIFY_SCHEME_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
			
			
			
		case 'RESET_SCHEME': 
			return Object.assign({}, state, {
				schemeuuid: null,
				opensuccess: false,
				openpending: false,
			});
			
			
		default: 
			return state;
	}
}

export default schemesReducer;
