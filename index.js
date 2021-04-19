/**
 * @author PrimusMoney
 * @homepage https://www.primusmoney.com/
 * @license UNLICENSED
 */
'use strict';


console.log('@primusmoney/react_client_wallet module');

if ( typeof window !== 'undefined' && window && (typeof window.simplestore === 'undefined')) {
	// browser or react-native
	console.log('creating window.simplestore in @primusmoney/react_client_wallet index.js');

	window.simplestore = {};
	
	window.simplestore.nocreation = true;
	
} else if ((typeof global !== 'undefined') && (typeof global.simplestore === 'undefined')) {
	// nodejs
	console.log('creating global.simplestore in @primusmoney/client_wallet index.js');
	global.simplestore = {};
}

const React_Client_Wallet = require('./react_client_wallet.js');


module.exports = React_Client_Wallet;