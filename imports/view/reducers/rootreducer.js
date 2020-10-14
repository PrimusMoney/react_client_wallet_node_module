import { combineReducers } from 'redux';

import cardsReducer from './card/card-reducer.js';
import contactsReducer from './contact/contact-reducer.js';
import erc20TokensReducer from './erc20token/erc20token-reducer.js';
import loginReducer from './login/login-reducer.js';
import schemesReducer from './scheme/scheme-reducer.js';
import sessionReducer from './login/session-reducer.js';
import transactionsReducer from './transaction/transaction-reducer.js';
import walletsReducer from './wallet/wallet-reducer.js';

const appReducer = combineReducers({
	cards: cardsReducer,
	contacts: contactsReducer,
	erc20tokens: erc20TokensReducer,
	login: loginReducer,
	schemes: schemesReducer,
	session: sessionReducer,
	transactions: transactionsReducer,
	wallets: walletsReducer
});

const rootReducer = (state, action) => {
	if (action.type === 'RESET_SESSION') {
		state = undefined
	}

	return appReducer(state, action)
}

export default rootReducer;