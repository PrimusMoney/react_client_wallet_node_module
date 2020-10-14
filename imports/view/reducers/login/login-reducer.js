
const initialState = {
		success: false,
		pending: false,
		sessionuuid: null,
		username: null,
		error: null
};

const loginReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_LOGIN_PENDING':
			return Object.assign({}, state, {
				pending: action.pending
			});
	
		case 'SET_LOGIN_SUCCESS':
			return Object.assign({}, state, {
				sessionuuid: action.sessionuuid,
				username: action.username,
				success: action.success
			});
	
		case 'SET_LOGIN_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
	
		case 'LOGOUT_SESSION':
			return Object.assign({}, state, {
				success: false
			});
			
	
		case 'CHECK_LOGIN_PENDING':
			return Object.assign({}, state, {
				checkpending: action.pending
			});
			
			
		case 'CHECK_LOGIN_SUCCESS':
			return Object.assign({}, state, {
				sessionuuid: action.sessionuuid,
				success: action.check,
				checkedon: action.checkedon,
			});

		case 'CHECK_LOGIN_ERROR':
			return Object.assign({}, state, {
				error: action.error
			});
	
		default:
			return state;
	}
}

export default loginReducer;