const initialState = {
	fetchpending: false,
	fetchsuccess: false,
	array: [],
	openpending: false,
	opensuccess: false,
	error: null
}

const cardsReducer = (state = initialState, action) => {
	switch(action.type) {
		case 'RESET_CARDS': 
			return Object.assign({}, state, {
				array: null,
				fetchpending: false,
				fetchsuccess: false
			});

		case 'FETCH_CARDS_PENDING': 
			return Object.assign({}, state, {
				fetchpending: action.pending
			});
		case 'FETCH_CARDS_SUCCESS':
			return Object.assign({}, state, {
				fetchsuccess: action.success,
				array: action.array
			});
		case 'FETCH_CARDS_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
		
		
		case 'RESET_CARD': 
			return Object.assign({}, state, {
				cardname: null,
				carduuid: null,
				opensuccess: false,
				openpending: false,
				islocked: true
			});

		case 'LOCK_CARD': 
			return Object.assign({}, state, {
				opensuccess: false,
				openpending: false,
				islocked: true
			});

			
			
		case 'OPEN_CARD_PENDING': 
			return Object.assign({}, state, {
				openpending: action.pending
			});
		case 'OPEN_CARD_SUCCESS':
			return Object.assign({}, state, {
				opensuccess: action.success,
				cardname: action.cardname,
				carduuid: action.carduuid
			});
		case 'OPEN_CARD_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
		

		case 'CREATE_CARD_PENDING': 
			return Object.assign({}, state, {
				createpending: action.pending
			});
		case 'CREATE_CARD_SUCCESS':
			return Object.assign({}, state, {
				createsuccess: action.success,
				cardname: action.cardname,
				carduuid: action.carduuid
			});
		case 'CREATE_CARD_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
		

		case 'IMPORT_CARD_PENDING': 
			return Object.assign({}, state, {
				importpending: action.pending
			});
		case 'IMPORT_CARD_SUCCESS':
			return Object.assign({}, state, {
				importsuccess: action.success,
				cardname: action.cardname,
				carduuid: action.carduuid
			});
		case 'IMPORT_CARD_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
		

		case 'MODIFY_CARD_PENDING': 
			return Object.assign({}, state, {
				modifypending: action.pending
			});
		case 'MODIFY_CARD_SUCCESS':
			return Object.assign({}, state, {
				modifysuccess: action.success,
				cardname: action.cardname,
				carduuid: action.carduuid
			});
		case 'MODIFY_CARD_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
		

		default: 
			return state;
	}
}

export default cardsReducer;
