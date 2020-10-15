'use strict';

var react_client_wallet;

class React_Client_Wallet {
	constructor() {
		this.load = null;
		
		this.initializing = false;
		this.initialized = false;
		
		this.initializationpromise = null;
		
		//var Ethereum_core = require('@p2pmoney-org/ethereum_core');
		var Ethereum_core = require('../../@p2pmoney-org/ethereum_core');
		
		this.ethereum_core = Ethereum_core.getObject();

		//var PrimusMoney_client_wallet = require('@primusmoney/client_wallet');
		var PrimusMoney_client_wallet = require('../../@primusmoney/client_wallet');
		
		this.primusmoney_client_wallet = PrimusMoney_client_wallet.getObject();
	}
	
	async init(callback) {
		console.log('@primusmoney/react_client_wallet init called');
		
		if (this.initialized) {
			console.log('module @primusmoney/react_client_wallet is already initialized.');
			return true;
		}
		
		if (this.initializing ) {
			console.log('module @primusmoney/react_client_wallet is already initializing. Wait till it\'s ready.');
			return this.initializationpromise;
		}

		// @primusmoney dependencies
		var primusmoney_client_wallet = this.primusmoney_client_wallet;	

		if (primusmoney_client_wallet.initialized === false) {
			await primusmoney_client_wallet.init();
		}

		
		
		// create loader
		if (typeof window !== 'undefined') {
			if (typeof document !== 'undefined' && document ) {
				// we are in a browser
				console.log('loading for browser');
				
				var BrowserLoad = require( './js/browser-load.js');

				this.load = new BrowserLoad(this);
			}
			else {
				// we are in react-native
				console.log('loading for react-native');
				
				var ReactNativeLoad = require( './js/react-native-load.js');

				this.load = new ReactNativeLoad(this);
			}	
		}
		else if (typeof global !== 'undefined') {
			console.log('loading for nodejs');
			
			// we are in nodejs
			var NodeLoad = require( './js/node-load.js');
			
			this.load = new NodeLoad(this);
		}

		var self = this;
		var promise;
		
		if (this.initializing === false) {

			this.initializationpromise = new Promise(function (resolve, reject) {
				self.load.init(function() {
				console.log('@primusmoney/react_client_wallet init finished');
				self.initialized = true;
				
				if (callback)
					callback(null, true);
				
				resolve(true);
				});
			});
			
			this.initializing = true;
			
		}
		
		return this.initializationpromise;
	}
	
	getGlobalObject() {
		if (typeof window !== 'undefined') {
			// we are in a browser or react-native
			return window.simplestore.Global.getGlobalObject();
		}
		else if (typeof global !== 'undefined') {
			// we are in nodejs
			return global.simplestore.Global.getGlobalObject();
		}
		
	}

	getMvcAPI() {
		var clientglobal = this.getGlobalObject();
		
		var mvcmodule = clientglobal.getModuleObject('mvc');

		return mvcmodule;
	}
	
	getControllersObject() {
		return require('./js/control/controllers.js').getObject();
	}

	// static methods
	static getObject() {
		if (react_client_wallet)
			return react_client_wallet;
		
			react_client_wallet = new React_Client_Wallet();
		
		return react_client_wallet;
	}
}

module.exports = React_Client_Wallet;