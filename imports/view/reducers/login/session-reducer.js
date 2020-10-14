const initialState = {
		success: false,
		pending: false,
		sessionuuid: null,
		error: null
};

const sessionReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_SESSION_CREATE_PENDING':
			return Object.assign({}, state, {
				pending: action.pending
			});
	
		case 'SET_SESSION_CREATE_SUCCESS':
			return Object.assign({}, state, {
				sessionuuid: action.sessionuuid,
				success: action.success
			});
	
		case 'SET_SESSION_CREATE_ERROR':
			return Object.assign({}, state, {
				sessionuuid: null,
				error: action.error
			});
	
		case 'SET_SESSION_CHECK_PENDING':
			return Object.assign({}, state, {
				pending: action.pending
			});
	
		case 'SET_SESSION_CHECK_SUCCESS':
			return Object.assign({}, state, {
				sessionuuid: action.sessionuuid,
				success: action.success
			});
	
		case 'SET_SESSION_CHECK_ERROR':
			return Object.assign({}, state, {
				sessionuuid: null,
				error: action.error
			});
	
		default:
			return state;
	}
}

export default sessionReducer;