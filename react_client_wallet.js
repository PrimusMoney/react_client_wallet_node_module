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
		
		this.primus_client_wallet = PrimusMoney_client_wallet.getObject();
	}
	
	getVersion() {
		var packagejson = require('./package.json');
		return packagejson.version;
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
		var primus_client_wallet = this.primus_client_wallet;	

		if (primus_client_wallet.initialized === false) {
			await primus_client_wallet.init();
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

	muteConsoleLog() {
		if (typeof window !== 'undefined') {
			if (!window.simplestore)
				return;

			// we are in a browser or react-native
			window.simplestore.noconsoleoverload = false;

			if (window.simplestore.Global) {
				var _clientglobal = window.simplestore.Global.getGlobalObject();

				_clientglobal.muteConsoleLog();
			}
		}
		else if (typeof global !== 'undefined') {
			if (!global.simplestore)
				return;

			// we are in nodejs
			global.simplestore.noconsoleoverload = false;

			if (global.simplestore.Global) {
				var _clientglobal = global.simplestore.Global.getGlobalObject();

				_clientglobal.muteConsoleLog();
			}
		}
	}

	// static methods
	static getObject() {
		if (react_client_wallet)
			return react_client_wallet;
		
			react_client_wallet = new React_Client_Wallet();
		
		return react_client_wallet;
	}
}

// use require('@primusmoney/react_client_wallet') to utilize React_Client_Wallet
// in code. If it is necessary to use import React_Client_Wallet, module should
// be conform to @primusmoney/react_pwa structuration of export and module.exports
module.exports = React_Client_Wallet;