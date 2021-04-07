'use strict';


var Module = class {
	
	constructor() {
		this.name = 'mvc-wallet';
		
		this.global = null; // put by global on registration
		this.app = null;
		
		this.controllers = null;

		this.isready = false;
		this.isloading = false;
		
		this.clientapicontrollers = null; // API gateway
	}
	
	init() {
		console.log('module init called for ' + this.name);

		var global = this.global;
		
		this.isready = true;
	}
	
	// compulsory  module functions
	loadModule(parentscriptloader, callback) {
		console.log('loadModule called for module ' + this.name);
		
		if (this.isloading)
			return;
			
		this.isloading = true;

		var self = this;

		var modulescriptloader = parentscriptloader.getChildLoader('mvcwalletloader');

		modulescriptloader.load_scripts(function() { self.init(); if (callback) callback(null, self); });

		return modulescriptloader;	
	}
	
	isReady() {
		return this.isready;
	}

	hasLoadStarted() {
		return this.isloading;
	}

	// optional module functions
	registerHooks() {
		console.log('module registerHooks called for ' + this.name);
		
		var global = this.global;
		
		
		// generic send
		global.registerHook('SendForm_recipient_changed_asynchook', this.name, this.SendForm_recipient_changed_asynchook);
		
		// wallet import
		global.registerHook('WalletImportForm_alterForm_hook', this.name, this.WalletImportForm_alterForm_hook);
		global.registerHook('WalletImportForm_configurl_changed_asynchook', this.name, this.WalletImportForm_configurl_changed_asynchook);
		global.registerHook('WalletImportForm_onImport_asynchook', this.name, this.WalletImportForm_onImport_asynchook);

		// card create
		global.registerHook('CardCreateForm_onCreate_asynchook', this.name, this.CardCreateForm_onCreate_asynchook);

		// card import
		global.registerHook('CardImportForm_alterForm_hook', this.name, this.CardImportForm_alterForm_hook);
		global.registerHook('CardImportForm_cardid_changed_asynchook', this.name, this.CardImportForm_cardid_changed_asynchook);
		global.registerHook('CardImportForm_configurl_changed_asynchook', this.name, this.CardImportForm_configurl_changed_asynchook);
		global.registerHook('CardImportForm_onImport_asynchook', this.name, this.CardImportForm_onImport_asynchook);
		
		// token import
		global.registerHook('ERC20TokenImportForm_alterForm_hook', this.name, this.ERC20TokenImportForm_alterForm_hook);
		global.registerHook('ERC20TokenImportForm_tokenid_changed_asynchook', this.name, this.ERC20TokenImportForm_tokenid_changed_asynchook);
		global.registerHook('ERC20TokenImportForm_onImport_asynchook', this.name, this.ERC20TokenImportForm_onImport_asynchook);

		// token transfer
		global.registerHook('ERC20TokenTransferForm_alterForm_hook', this.name, this.ERC20TokenTransferForm_alterForm_hook);
		global.registerHook('ERC20TokenTransferForm_amount_changed_asynchook', this.name, this.ERC20TokenTransferRequestForm_amount_changed_asynchook);
		global.registerHook('ERC20TokenTransferForm_recipient_changed_asynchook', this.name, this.ERC20TokenTransferRequestForm_recipient_changed_asynchook);
		global.registerHook('ERC20TokenTransferForm_onTransfer_asynchook', this.name, this.ERC20TokenTransferForm_onTransfer_asynchook);

		// token request (using same hooks as transfer for input changed)
		global.registerHook('ERC20TokenRequestForm_alterForm_hook', this.name, this.ERC20TokenRequestForm_alterForm_hook);
		global.registerHook('ERC20TokenRequestForm_amount_changed_asynchook', this.name, this.ERC20TokenTransferRequestForm_amount_changed_asynchook);
		global.registerHook('ERC20TokenRequestForm_recipient_changed_asynchook', this.name, this.ERC20TokenTransferRequestForm_recipient_changed_asynchook);
		global.registerHook('ERC20TokenRequestForm_onRequest_asynchook', this.name, this.ERC20TokenRequestForm_onRequest_asynchook);
	}
	
	postRegisterModule() {
		console.log('postRegisterModule called for ' + this.name);
		if (!this.isloading) {
			var global = this.global;
			var self = this;
			var rootscriptloader = global.getRootScriptLoader();
			
			this.loadModule(rootscriptloader, function() {
				if (self.registerHooks)
				self.registerHooks();
			});
		}
	}
	
	_getClientAPI() {
		if (this.clientapicontrollers)
			return this.clientapicontrollers;
		
		var global = this.global;
		
		var mvcmodule = global.getModuleObject('mvc');
		
		this.clientapicontrollers = mvcmodule._getClientAPI();
		
		return  this.clientapicontrollers;
	}
	
	// API
	
	// contacts
	async getContactInfo(session, contact) {
		// TODO: would certainly make more sense to have mvc call mvc-wallet instead
		var global = this.global;
		var mvcmodule = global.getModuleObject('mvc');
		
		return mvcmodule.getContactInfo(session.getSessionUUID(), contact.getContactUUID());
	}
	
	// schemes
	async getSchemeInfo(session, scheme) {
		// TODO: would certainly make more sense to have mvc call mvc-wallet instead
		var global = this.global;
		var mvcmodule = global.getModuleObject('mvc');
		
		return mvcmodule.getSchemeInfo(session.getSessionUUID(), scheme.getSchemeUUID());
	}
	
	// wallets
	async getWalletInfo(session, wallet) {
		// TODO: would certainly make more sense to pass objects in parameters and have mvc call mvc-wallet
		var global = this.global;
		var mvcmodule = global.getModuleObject('mvc');
		
		return mvcmodule.getWalletInfo(session.getSessionUUID(), wallet.getWalletUUID());
	}
	
	// cards
	async getCardInfo(session, wallet, card) {
		// TODO: would certainly make more sense to pass objects in parameters and have mvc call mvc-wallet
		var global = this.global;
		var mvcmodule = global.getModuleObject('mvc');
		
		return mvcmodule.getCardInfo(session.getSessionUUID(), wallet.getWalletUUID(), card.getCardUUID());
	}

	
	// token accounts
	async getERC20TokenAccountInfo(session, wallet, tokenaccount) {
		// TODO: would certainly make more sense to have mvc call mvc-wallet instead
		var global = this.global;
		var mvcmodule = global.getModuleObject('mvc');
		
		return mvcmodule.getERC20TokenAccountInfo(session.getSessionUUID(), wallet.getWalletUUID(), tokenaccount.getCard().getCardUUID(), tokenaccount.getTokenAccountUUID());
	}
	

	
	
	//
	// hooks
	//
	
	// generic send form
	async SendForm_recipient_changed_asynchook(result, params) {
		console.log('SendForm_recipient_changed_asynchook called for ' + this.name);
		
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		result.push({module: this.name, handled: true});

		var sessionuuid = params[0];
		var recipient = params[1];
		
		var bCheck = false;
		var found = [];
		
		var session = await _apicontrollers.getSessionObject(sessionuuid);
		
		if (!session)
			return false;
		
		// get list of contacts on the phone
		var contacts = await _apicontrollers.getContactList(session, true);
		
		
		// go through the retrieved contact list
		var count = 0;
		
		// search based on emails first letters
		for (var i = 0; i < contacts.length; i++) {
			var name = contacts[i].getName();
			var label = contacts[i].getLabel();
			var email = contacts[i].getEmail();
			var phone = contacts[i].getPhone();
			var uuid = contacts[i].getContactUUID();
			var address = contacts[i].getAddress();
			var type = contacts[i].getContactType();
			var rsa_public_key = contacts[i].getRsaPublicKey();
			
			if (email && email.startsWith(recipient)) {
				found.push({name: name, label: label, email: email, phone: phone, uuid: uuid, address: address, type: type, rsa_public_key: rsa_public_key});
				count++;
			}
		}
		
		if (count == 1)
			bCheck = true;

		
		if (bCheck)
			result.recipientcheck.push({module: this.name, check: true, found: found});
		else 
			result.recipientcheck.push({module: this.name, check: false, found: found});
		
		return true;
	}
	
	
	// wallet import form
	WalletImportForm_alterForm_hook(result, params) {
		console.log('WalletImportForm_alterForm_hook called for ' + this.name);
		
		var form = params[0];
		
		result.push({module: this.name, handled: true});
		
		return true;
	}
	
	async WalletImportForm_configurl_changed_asynchook(result, params) {
		console.log('WalletImportForm_configurl_changed_asynchook called for ' + this.name);
		
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		result.push({module: this.name, handled: true});
		
		var sessionuuid = params[0];
		var configurl = params[1];
		
		var bCheck = false;
		
		var session = await _apicontrollers.getSessionObject(sessionuuid);
		
		if (!session)
			return false;
		
		var validconfig = await _apicontrollers.isValidSchemeConfig(session, configurl)
		.catch(err => {
			bCheck = false;
		});

		if (validconfig)
			bCheck = true;
		

		if (bCheck)
			result.configurlcheck.push({module: this.name, check: true});
		else 
			result.configurlcheck.push({module: this.name, check: false});
		
		return true;
	}

	async WalletImportForm_onImport_asynchook(result, params) {
		console.log('WalletImportForm_onImport_asynchook called for ' + this.name);
		
		var global = this.global;
		
		result.push({module: this.name, handled: true});

		var input = params[0];
		var output = params[1];
		
		var rootsessionuuid = input.rootsessionuuid;
		var walletuuid = input.walletuuid;
		
		return true;
	}
	
	// card create form
	async CardCreateForm_onCreate_asynchook(result, params) {
		console.log('CardCreateForm_onCreate_asynchook called for ' + this.name);
		
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		
		result.push({module: this.name, handled: true});

		var input = params[0];
		var output = params[1];
		
		var sessionuuid = input.rootsessionuuid;
		var walletuuid = input.walletuuid;
		var cardname = input.cardname;
		var configurl = input.configurl;
		
		var session = await _apicontrollers.getSessionObject(sessionuuid);
		
		if (!session)
			return false;
		
		var wallet = await _apicontrollers.getWalletFromUUID(session, walletuuid);
		
		if (!wallet)
			return false;
		
		var wallettype = wallet.getWalletType();
		var scheme;
		
		switch(wallettype) {
			case 0:
				// check first if it is a config url
				validconfig = await _apicontrollers.isValidSchemeConfig(session, configurl)
				.catch(err => {
					validconfig = false;
				});

				
				if (validconfig) {
					scheme = await _apicontrollers.importScheme(session, configurl);
					
					output.schemeuuid = scheme.getSchemeUUID();
				}
				else {
					// then if it is a web3 url
					var validconfig = await _apicontrollers.isValidEthnodeRPC(session, configurl)
					.catch(err => {
						validconfig = false;
					});
					
					if (validconfig) {
						// get list of local schemes
						var localschemes = await _apicontrollers.getLocalSchemeList(session, true);
						var bCreateScheme = true;
						
						for (var i = 0; i < localschemes.length; i++) {
							// compare with web3_provider_url to see if we have a scheme that matches
							var networkconfig = localschemes[i].getNetworkConfig()
							if (networkconfig.ethnodeserver.web3_provider_url == configurl) {
								bCreateScheme = false;
								scheme = localschemes[i];
								break;
							}
						}
						
						if (bCreateScheme) {
							// else we create a local scheme and save it
							var defaultlocalscheme = await _apicontrollers.getDefaultScheme(session, 0);
							scheme = await defaultlocalscheme.cloneOnWeb3ProviderUrl(configurl);
						}
						
						if (scheme)
							output.schemeuuid = scheme.getSchemeUUID();
					}

				}
				break;
			case 1:
				break;
			default:
				break;
		}

		return true;
	}	
	
	// card import form
	CardImportForm_alterForm_hook(result, params) {
		console.log('CardImportForm_alterForm_hook called for ' + this.name);
		
		var form = params[0];
		
		var wallettype = form.context.wallettype;
		var cardtype = form.context.cardtype;
		
		switch (wallettype) {
			case 0:
				
				switch(cardtype) {
					case 0:
						form.configurl.placeholder = 'rpc url';
						form.authname.disable = true;
						form.password.disable = true;
						break;
					case 1:
						form.cardid.placeholder = 'remote name, address, private key';
						form.configurl.placeholder = 'url given to import your card';
						break;
					default:
						break;
				}
				break;
				
			case 1:
				form.cardid.placeholder = 'remote name, address, private key';
				form.configurl.disable = true;
				form.authname.disable = true;
				form.password.disable = true;
				break;
				
			default:
				break;
		}

		
		result.push({module: this.name, handled: true});
		
		return true;
	}
	
	async CardImportForm_cardid_changed_asynchook(result, params) {
		console.log('CardImportForm_cardid_changed_asynchook called for ' + this.name);
		
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		result.push({module: this.name, handled: true});

		var sessionuuid = params[0];
		var walletuuid = params[1];
		var cardid = params[2];
		
		var bCheck = false;
		var found = [];
		
		var session = await _apicontrollers.getSessionObject(sessionuuid);
		
		if (!session)
			return false;
		
		var wallet = await _apicontrollers.getWalletFromUUID(session, walletuuid);
		
		if (!wallet)
			return false;
		
		// see if cardid is a valid address
		var wallettype = wallet.getWalletType();
		
		switch(wallettype) {
			case 0:
				if (_apicontrollers.isValidPrivateKey(session, cardid)) {
					var publickeys = _apicontrollers.getPublicKeys(session, cardid);
					var address = publickeys['address'];
					
					found.push({label: cardid, uuid: cardid, address: address});
					bCheck = true;
				}
				break;
			case 1:
				if (_apicontrollers.isValidPrivateKey(session, cardid)) {
					var publickeys = _apicontrollers.getPublicKeys(session, cardid);
					var address = publickeys['address'];
					
					found.push({label: cardid, uuid: cardid, address: address});
					bCheck = true;
				}
				else if (_apicontrollers.isValidAddress(session, cardid)) {
					var sessionaccounts = await wallet.getSessionAccountObjects(true);
					for (var i = 0; i < sessionaccounts.length; i++) {
						var accountaddress = sessionaccounts[i].getAddress();
						
						if (session.areAddressesEqual(accountaddress, cardid)) {
							found.push({label: cardid, uuid: cardid, address: cardid});
							bCheck = true;
							break;
						}
					}
				}
				else {
					// search on description
					var sessionaccounts = await wallet.getSessionAccountObjects(true);
					var count = 0
					
					for (var i = 0; i < sessionaccounts.length; i++) {
						var description = sessionaccounts[i].getDescription();
						var uuid = sessionaccounts[i].getAccountUUID();
						var address = sessionaccounts[i].getAddress();
						
						if (description.startsWith(cardid)) {
							found.push({label: description, uuid: uuid, address: address});
							count++;
						}
					}
					
					if (count == 1) {
						bCheck = true;
					}
					
				}
				break;
			default:
				break;
		}
		

		
		if (bCheck)
			result.cardidcheck.push({module: this.name, check: true, found: found});
		else 
			result.cardidcheck.push({module: this.name, check: false, found: found});
		
		return true;
	}
	
	async CardImportForm_configurl_changed_asynchook(result, params) {
		console.log('CardImportForm_configurl_changed_asynchook called for ' + this.name);
		
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		result.push({module: this.name, handled: true});
		
		var sessionuuid = params[0];
		var walletuuid = params[1];
		var configurl = params[2];
		var cardtype = params[3];
		
		var bCheck = false;
		
		var session = await _apicontrollers.getSessionObject(sessionuuid);
		
		if (!session)
			return false;
		
		var wallet = await _apicontrollers.getWalletFromUUID(session, walletuuid);
		
		if (!wallet)
			return false;
		
		var wallettype = wallet.getWalletType();
		var validconfig = false;
		
		switch(wallettype) {
			case 0:
				switch(cardtype) {
					case 0:
						// first check if this is a valid config url
						validconfig = await _apicontrollers.isValidSchemeConfig(session, configurl)
						.catch(err => {
							bCheck = false;
						});

						if (!validconfig) {
							// check if this is not a web3 provider url 
							validconfig = await _apicontrollers.isValidEthnodeRPC(session, configurl)
							.catch(err => {
								bCheck = false;
							});
							
						}
						break;
					case 1:
						validconfig = await _apicontrollers.isValidSchemeConfig(session, configurl)
						.catch(err => {
							bCheck = false;
						});
						break;
					default:
						break;
				}
				break;
			case 1:
				break;
			default:
				break;
		}
		

		if (validconfig)
			bCheck = true;
		

		if (bCheck)
			result.configurlcheck.push({module: this.name, check: true});
		else 
			result.configurlcheck.push({module: this.name, check: false});
		
		return true;
	}
	
	async _getSessionAccountFromPrivateKey(session, wallet, privatekey) {
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		return _apicontrollers.getSessionAccountFromPrivateKey(session, wallet, privatekey)
	}
	
	async _getSessionAccountFromAddress(session, wallet, address) {
		var sessionaccount;
		
		var sessionaccounts = await wallet.getSessionAccountObjects(true);

		for (var i = 0; i < sessionaccounts.length; i++) {
			var accountaddress = sessionaccounts[i].getAddress();
			
			if (session.areAddressesEqual(accountaddress, address)) {
				sessionaccount = sessionaccounts[i];
				break;
			}
		}
		
		return sessionaccount;
	}
	
	async _getSessionAccountFromIdentifier(session, wallet, id) {
		var sessionaccount;
		
		var sessionaccounts = await wallet.getSessionAccountObjects(true);
		
		for (var i = 0; i < sessionaccounts.length; i++) {
			var description = sessionaccounts[i].getDescription();
			
			if (description.startsWith(id)) {
				sessionaccount = sessionaccounts[i];
				break;
			}
		}
		
		return sessionaccount;
	}


	async CardImportForm_onImport_asynchook(result, params) {
		console.log('CardImportForm_onImport_asynchook called for ' + this.name);
		
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		
		result.push({module: this.name, handled: true});

		var input = params[0];
		var output = params[1];
		
		var sessionuuid = input.rootsessionuuid;
		var walletuuid = input.walletuuid;
		var cardid = input.cardid;
		var cardtype = input.cardtype;
		var configurl = input.configurl;
		
		var session = await _apicontrollers.getSessionObject(sessionuuid);
		
		if (!session)
			return false;
		
		var wallet = await _apicontrollers.getWalletFromUUID(session, walletuuid);
		
		if (!wallet)
			return false;
		
		// see if cardid is a valid address
		var wallettype = wallet.getWalletType();
		var validconfig = false;
		
		switch(wallettype) {
			case 0:
				if (_apicontrollers.isValidPrivateKey(session, cardid)) {
					var sessionaccount = await this._getSessionAccountFromPrivateKey(session, wallet, cardid)	
					
					if (sessionaccount)
					output.address = sessionaccount.getAddress();
				}
				
				
				switch(cardtype) {
					case 0:
						// check config url first
						validconfig = await _apicontrollers.isValidSchemeConfig(session, configurl)
						.catch(err => {
							validconfig = false;
						});

						
						if (validconfig) {
							output.configurl = configurl;
						}
						else {
							// then if it is a web3 url
							var validconfig = await _apicontrollers.isValidEthnodeRPC(session, configurl)
							.catch(err => {
								validconfig = false;
							});
							
							if (validconfig) {
								var scheme;
								
								// get list of local schemes
								var localschemes = await _apicontrollers.getLocalSchemeList(session, true);
								var bCreateScheme = true;
								
								for (var i = 0; i < localschemes.length; i++) {
									// compare with web3_provider_url to see if we have a scheme that matches
									var networkconfig = localschemes[i].getNetworkConfig()
									if (networkconfig.ethnodeserver.web3_provider_url == configurl) {
										bCreateScheme = false;
										scheme = localschemes[i];
										break;
									}
								}
								
								if (bCreateScheme) {
									// else we create a local scheme and save it
									var defaultlocalscheme = await _apicontrollers.getDefaultScheme(session, 0);
									scheme = await defaultlocalscheme.cloneOnWeb3ProviderUrl(configurl);
								}
								
								if (scheme)
									output.configurl = 'storage://scheme?uuid=' + scheme.getSchemeUUID();
							}

						}
						break;
					case 1:
						validconfig = await _apicontrollers.isValidSchemeConfig(session, configurl)
						.catch(err => {
							validconfig = false;
						});
						
						if (validconfig) {
							output.configurl = configurl;
						}
						
						if (_apicontrollers.isValidPrivateKey(session, cardid)) {
							var sessionaccount = await this._getSessionAccountFromPrivateKey(session, wallet, cardid);
							
							if (sessionaccount)
							output.address = sessionaccount.getAddress();
						}
						else if (_apicontrollers.isValidAddress(session, cardid)) {
							output.address = cardid;
						}
						break;
					default:
						break;
				}
				break;
			case 1:
				if (_apicontrollers.isValidPrivateKey(session, cardid)) {
					var sessionaccount = await this._getSessionAccountFromPrivateKey(session, wallet, cardid);
					
					if (sessionaccount)
					output.address = sessionaccount.getAddress();
				}
				else if (_apicontrollers.isValidAddress(session, cardid)) {
					var sessionaccount = await this._getSessionAccountFromAddress(session, wallet, cardid);
					
					if (sessionaccount)
					output.address = sessionaccount.getAddress();
				}
				else {
					var sessionaccount = await this._getSessionAccountFromIdentifier(session, wallet, cardid);
					
					if (sessionaccount)
					output.address = sessionaccount.getAddress();
				}				
				break;
			default:
				break;
		}

		return true;
	}
	
	// tokens
	ERC20TokenImportForm_alterForm_hook(result, params) {
		console.log('ERC20TokenImportForm_alterForm_hook called for ' + this.name);
		
		var form = params[0];
		var cardtype = params[1];
		
		switch(cardtype) {
			case 0:
				form.tokenid.placeholder = 'token address';
				break;
			case 1:
				form.tokenid.placeholder = 'token symbol, name, address or remote description';
				break;
			default:
				break;
		}
		
		result.push({module: this.name, handled: true});
		
		return true;
	}
	
	async ERC20TokenImportForm_tokenid_changed_asynchook(result, params) {
		console.log('ERC20TokenImportForm_tokenid_changed_asynchook called for ' + this.name);
		
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		result.push({module: this.name, handled: true});

		var sessionuuid = params[0];
		var walletuuid = params[1];
		var carduuid = params[2];
		var tokenid = params[3];
		
		var bCheck = false;
		
		var session = await _apicontrollers.getSessionObject(sessionuuid);
		
		if (!session)
			return false;
		
		var wallet = await _apicontrollers.getWalletFromUUID(session, walletuuid);
		
		if (!wallet)
			return false;
		
		var card = await wallet.getCardFromUUID(carduuid)
		.catch(err => {});
		
		if (card) {
			if (card.isLocked())
				await card.unlock();
			
			var cardtype = card.getCardType();
			
			switch(cardtype) {
				case 0:
					// if this is a valid address
					if (_apicontrollers.isValidAddress(session, tokenid)) {
						bCheck = true;
					}
					break;
				case 1:
					if (_apicontrollers.isValidAddress(session, tokenid)) {
						// if this is a valid address
						bCheck = true;
					}
					else {
						// get list of tokens
						var tokens = await card.getTokenList(true);
						var count = 0
						
						// look if it is a token symbol
						for (var i = 0; i < (tokens ? tokens.length : 0); i++) {
							var tkn = tokens[i];
							var isonchain = await tokens[i].isOnChain();
							var symbol = tkn.getSymbol();
							
							if (isonchain && (tokenid == symbol)) { // same case
								count = 1;
								break;
							}
						}
						
						if (count == 0) {
							// look if it the start of a name
							for (var i = 0; i < (tokens ? tokens.length : 0); i++) {
								var tkn = tokens[i];
								var isonchain = await tokens[i].isOnChain();
								var name = tkn.getName();
								
								if (isonchain && name && name.startsWith(tokenid)) {
									count++;
								}
							}
						}
						
						if (count == 0) {
							// look if it the start of a description
							for (var i = 0; i < (tokens ? tokens.length : 0); i++) {
								var tkn = tokens[i];
								var isonchain = await tokens[i].isOnChain();
								var description = tkn.getDescription();
								
								if (isonchain && description && description.startsWith(tokenid)) {
									count++;
								}
							}
						}
						
						if (count == 1) {
							bCheck = true;
						}
					}
					break;
				default:
					break;
			}
		}
		else {
			// e.g. import of token from applink with a private key
			if (_apicontrollers.isValidAddress(session, tokenid)) {
				bCheck = true;
			}
		}

		
		if (bCheck)
			result.tokenidcheck.push({module: this.name, check: true});
		else 
			result.tokenidcheck.push({module: this.name, check: false});
		
		return true;
	}
	
	async ERC20TokenImportForm_onImport_asynchook(result, params) {
		console.log('ERC20TokenImportForm_onImport_asynchook called for ' + this.name);
		
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		result.push({module: this.name, handled: true});

		var input = params[0];
		var output = params[1];
		
		var rootsessionuuid = input.rootsessionuuid;
		var walletuuid = input.walletuuid;
		var carduuid = input.carduuid;
		var privatekey = input.privatekey;
		var tokenid = input.tokenid;
		var tokenname = input.tokenname;
		var tokenlabel = input.tokenlabel;
		var web3url = input.web3url;
		
		var token;
		var tokenuuid;
		
		try {
			var session = await _apicontrollers.getSessionObject(rootsessionuuid);
			
			if (!session)
				return false;
			
			var wallet = await _apicontrollers.getWalletFromUUID(session, walletuuid);
			
			if (!wallet)
				return false;
			
			var card = await wallet.getCardFromUUID(carduuid);
			
			if (!card)
				return false;
			
			if (card.isLocked())
				await card.unlock();
			
			var cardtype = card.getCardType();
			var Token = global.getModuleClass('wallet', 'Token');
			
			switch(cardtype) {
				case 0:
					// if this is a valid address
					if (_apicontrollers.isValidAddress(session, tokenid)) {
						token = card.getTokenObject(tokenid);
						
						token.setLabel(tokenlabel);
						// note: token necessarily takes card's scheme web3 url
						
						token.setTokenType(Token.STORAGE_TOKEN); // we want it to persist in storage

						await card.saveToken(token);
						
						tokenuuid = token.getTokenUUID();
					}
					break;
				case 1:
					if (_apicontrollers.isValidAddress(session, tokenid)) {
						// if this is a valid address
						token = card.getTokenObject(tokenid);
						
						token.setLabel(tokenlabel);
						token.setWeb3providerUrl(web3url);
						
						token.setTokenType(Token.STORAGE_TOKEN); // we want it to persist in storage

						await card.saveToken(token);
						
						tokenuuid = token.getTokenUUID();
					}
					else {
						// get list of tokens
						var tokens = await card.getTokenList(true);
						var count = 0
						
						// look if it is a token symbol
						for (var i = 0; i < (tokens ? tokens.length : 0); i++) {
							var tkn = tokens[i];
							var symbol = tkn.getSymbol();
							
							if (tokenid == symbol) { // same case
								tokenuuid = tkn.getTokenUUID();;
								break;
							}
						}
						
						if (!tokenuuid) {
							// look if it the start of a name
							for (var i = 0; i < (tokens ? tokens.length : 0); i++) {
								var tkn = tokens[i];
								var name = tkn.getName();
								
								if (name && name.startsWith(tokenid)) {
									tokenuuid = tkn.getTokenUUID();;
									break;
								}
							}
						}
						
						if (!tokenuuid) {
							// look if it the start of a description
							for (var i = 0; i < (tokens ? tokens.length : 0); i++) {
								var tkn = tokens[i];
								var description = tkn.getDescription();
								
								if (description && description.startsWith(tokenid)) {
									tokenuuid = tkn.getTokenUUID();;
									break;
								}
							}
						}
					}
					break;
				default:
					break;
			}

		}
		catch(e) {
			console.log('exception in ERC20TokenImportForm_onImport_asynchook: ' + e);
		}
		
		
		if (tokenuuid)
		output.tokenuuid = tokenuuid;
		
		return true;
	}
	


	// token transfer form
	ERC20TokenTransferForm_alterForm_hook(result, params) {
		console.log('ERC20TokenTransferForm_alterForm_hook called for ' + this.name);
		
		var form = params[0];
		var cardtype = params[1];
		var sendasgiftcardchecked = params[2];
		
		switch(cardtype) {
			case 0:
				if (!sendasgiftcardchecked)
				form.recipient.placeholder += '- give first letters of contact';
				break;
			case 1:
				if (!sendasgiftcardchecked)
				form.recipient.placeholder += '- give first letters of local contact or registered account';
				break;
			default:
				break;
		}
		
		result.push({module: this.name, handled: true});
		
		return true;
	}
	
	async ERC20TokenTransferRequestForm_amount_changed_asynchook(result, params) {
		console.log('ERC20TokenTransferRequestForm_amount_changed_asynchook called for ' + this.name);
		
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		result.push({module: this.name, handled: true});

		var sessionuuid = params[0];
		var walletuuid = params[1];
		var carduuid = params[2];
		var amountstring = params[3];
		
		var bCheck = false;
		
		// check amount is number with 2 decimals at maximum
		// DEFAULT_TOKEN_DECIMALS = 2
		if (!isNaN(amountstring)) {
			var split = amountstring.toString().split(".");
			var decimals = ( typeof split[1] !== 'undefined' ? (split[1].length == 2 ? 2 : -1) : 0);

			if ((decimals == 0) || (decimals == 2))
				bCheck = true;
		}
		
		if (bCheck)
			result.amountcheck.push({module: this.name, check: true});
		else 
			result.amountcheck.push({module: this.name, check: false});
		
		return true;
	}
	
	_fillContactInfo(contactinfo, contact) {
		contactinfo.name = contact.getName();
		contactinfo.label = contact.getLabel();
		contactinfo.address = contact.getAddress();
		contactinfo.email = contact.getEmail();
		contactinfo.phone = contact.getPhone();
		contactinfo.uuid = contact.getContactUUID();
		contactinfo.type = contact.getContactType();
		contactinfo.rsa_public_key = contact.getRsaPublicKey();

		return contactinfo;
	}
	
	async getWalletCardsAsContactList(session, wallet) {
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		var array = [];
		
		var contacts = await _apicontrollers.getWalletCardsAsContactList(session, wallet, true);
		
		for (var i = 0; i < contacts.length; i++) {
			var contactinfo = {};
			
			this._fillContactInfo(contactinfo, contacts[i]);
			array.push(contactinfo);
		}

		return array;
	}

	async _getContactList(session) {
		var global = this.global;
		var _apicontrollers = this._getClientAPI();

		var array = [];
		
		// list of contacts on the phone
		var contacts = await _apicontrollers.getContactList(session, true);
		
		for (var i = 0; i < (contacts ? contacts.length : 0); i++) {
			var contactinfo = {};
			
			this._fillContactInfo(contactinfo, contacts[i]);
			array.push(contactinfo);
		}
		
		return array;
	}
	
	async _getWalletContactList(session, wallet, bAllCards = true) {
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		// first the list of contacts on the phone
		var array = await this._getContactList(session);
		
		// then add list of cards in the wallet
		if (bAllCards) {
			var cardcontacts = await this.getWalletCardsAsContactList(session, wallet);
			
			array = array.concat(cardcontacts);
		}


		// finally depending on wallet type, get additional contacts
		var wallettype = wallet.getWalletType();
		
		switch(wallettype) {
			case 0:
				break;
			case 1:
				var remoteaccounts = await wallet.getAccountObjects(true);
				
				for (var i = 0; i < remoteaccounts.length; i++) {
					var name = remoteaccounts[i].getDescription();
					var label = remoteaccounts[i].getDescription();
					var address = remoteaccounts[i].getAddress();
					var type = 1;
					
					array.push({name: name, label: label, address: address, type: type});
				}
				break;
			default:
				break;
		}
		
		return array;
	}
	
	async _getCardContactList(session, card) {
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		// first the wallet contacts (without all other cards)
		var wallet = card.getWallet();
		var array = await this._getWalletContactList(session, wallet, false);
		
		// then add list of sibling cards (on same scheme) in the wallet
		var cardsiblings = await wallet.getCardsOnSameScheme(card);
		
		for (var i = 0; i < (cardsiblings ? cardsiblings.length : 0); i++) {
			var cardsibling = cardsiblings[i];
			var contact = await _apicontrollers.getWalletCardAsContact(session, wallet, cardsibling);
			
			var contactinfo = {};
			
			this._fillContactInfo(contactinfo, contact);
			array.push(contactinfo);
		}
		
		return array;
	}

	

	
	async ERC20TokenTransferRequestForm_recipient_changed_asynchook(result, params) {
		console.log('ERC20TokenTransferRequestForm_recipient_changed_asynchook called for ' + this.name);
		
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		result.push({module: this.name, handled: true});

		var sessionuuid = params[0];
		var walletuuid = params[1];
		var carduuid = params[2];
		var recipient = params[3];
		
		// specific to TransferForm
		var recipientcontactuuid = (params[4] && params[4].length ? params[4] : null);
		var sendasgiftcardchecked = params[5];
		
		var bCheck = false;
		var found = [];
		
		var session = await _apicontrollers.getSessionObject(sessionuuid);
		
		if (!session)
			return false;
		
		if (recipientcontactuuid) {
			// check if it is correct, then return check = true if so
			var contact = await _apicontrollers.getContactFromUUID(session, recipientcontactuuid)
			.catch(err => {});
			
			if (contact) {
				var label = contact.getLabel();
				var email = contact.getEmail();
				var uuid = contact.getContactUUID();
				var address = contact.getAddress();
				var type = contact.getContactType();
				
				found.push({label: label, uuid: uuid, address: address, type: type});

				result.recipientcheck.push({module: this.name, check: true, found: found});
				
				return true;
			}
		}
		
		var wallet = await _apicontrollers.getWalletFromUUID(session, walletuuid);
		
		if (!wallet)
			return false;
		
		var card = await wallet.getCardFromUUID(carduuid);
		
		if (!card)
			return false;
		
		if (card.isLocked())
			await card.unlock();
		
		var cardtype = card.getCardType();

		// if this is a valid address
		if (_apicontrollers.isValidAddress(session, recipient)) {
			found.push({label: recipient, address: recipient});
			bCheck = true;
		}
		else {
			// get list of contacts (with cards on same scheme than carduuid)
			var contacts = await this._getCardContactList(session, card);
			
			
			// go through the retrieved contact list
			var count = 0;
			
			// search based on emails first
			for (var i = 0; i < contacts.length; i++) {
				var email = contacts[i].email;
				var uuid = contacts[i].uuid;
				var address = contacts[i].address;
				var type = contacts[i].type;
				
				if (email && email.startsWith(recipient)) {
					found.push({label: email, uuid: uuid, address: address, type: type});
					count++;
				}
			}
			
			if (count == 1)
				bCheck = true;
			else if (count == 0) {
				// then search based on label
				for (var i = 0; i < contacts.length; i++) {
					var label = contacts[i].label;
					var email = contacts[i].email;
					var uuid = contacts[i].uuid;
					var address = contacts[i].address;
					var type = contacts[i].type;
					
					if (label && label.startsWith(recipient)) {
						found.push({label: label, uuid: uuid, address: address, type: type});
						count++;
					}
				}

				if (count == 1)
					bCheck = true;
				else
					bCheck = false;
			}
			else {
				bCheck = false;
			}
		}
		

		
		if (bCheck)
			result.recipientcheck.push({module: this.name, check: true, found: found});
		else 
			result.recipientcheck.push({module: this.name, check: false, found: found});
		
		return true;
	}
	
	async _getValidLocalContact(session, wallet, recipient) {
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		var contact;
		
		var contactuuid;

		var remotecontact;
		var bCopyRemoteContact;
		
		var contacts = await this._getWalletContactList(session, wallet);

		// go through the retrieved contact list
		
		// search based on emails first
		for (var i = 0; i < contacts.length; i++) {
			var email = contacts[i].email;
			
			if (email && email.startsWith(recipient)) {
				if (contacts[i].uuid) {
					// local contact (has an uuid)
					contact = await _apicontrollers.getContactFromUUID(session, contacts[i].uuid);

					contactuuid = contacts[i].uuid;
					break;
				}
				else {
					bCopyRemoteContact = true;
					remotecontact = contacts[i]; // remote have no email attribute at this time (2020.04.03)!
				}
			}
		}
		
		if (!contactuuid) {
			// then search based on labels
			for (var i = 0; i < (contacts ? contacts.length : 0); i++) {
				var label = contacts[i].label;
				
				if (label && label.startsWith(recipient)) {
					if (contacts[i].uuid) {
						// local contact (has an uuid)
						contact = await _apicontrollers.getContactFromUUID(session, contacts[i].uuid);

						contactuuid = contacts[i].uuid;
						break;
					}
					else {
						bCopyRemoteContact = true;
						remotecontact = contacts[i];
					}
				}
			}

		}
		
		
		if (contactuuid) {
			return contact;
		}
		else if (bCopyRemoteContact) {
			var address = remotecontact.address;
			var name = remotecontact.name;
			var label = remotecontact.label;
			var contactinfo = {label: label};
			
			contact = await _apicontrollers.createContact(session, name, address, contactinfo);
		}
		else if (_apicontrollers.isValidAddress(session, recipient)) {
			var address = recipient;
			
			// look if one of the contacts has this address
			for (var i = 0; i < (contacts ? contacts.length : 0); i++) {
				var contactaddress = contacts[i].address;
				
				if (session.areAddressesEqual(address, contactaddress)) {
					if (contacts[i].uuid) {
						contact = contacts[i];
						break;
					}
					else {
						// remote contact, we copy contact locally
						var name = contacts[i].name;
						var label = contacts[i].label;
						var contactinfo = {label: label};
						
						contact = await _apicontrollers.createContact(session, name, address, contactinfo);
						
						break;
					}
				}
			}
			
			if (!contact) {
				// we create a contact on the fly
				var shortaddress = address.substring(0,4) + '...' + address.substring(address.length - 4,address.length);
				var name = 'contact - ' + shortaddress;
				var label = 'contact - ' + shortaddress;
				var contactinfo = {label: label};
				
				contact = await _apicontrollers.createContact(session, name, address, contactinfo);
			}
			
			
		}
		
		return contact;
	}
	
	async ERC20TokenTransferForm_onTransfer_asynchook(result, params) {
		console.log('ERC20TokenTransferForm_onTransfer_asynchook called for ' + this.name);
		
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		result.push({module: this.name, handled: true});

		var input = params[0];
		var output = params[1];
		
		var rootsessionuuid = input.rootsessionuuid;
		var walletuuid = input.walletuuid;
		var carduuid = input.carduuid;
		var tokenuuid = input.tokenuuid;
		var recipient = input.recipient;
		var recipientcontactuuid = input.recipientcontactuuid;
		var sendasgiftcard = input.sendasgiftcard;
		
		if (sendasgiftcard) {
			// we don't do anything
			// we let ERC20TokenTransferForm generate the private key
			return true;
		}
		
		var session = await _apicontrollers.getSessionObject(rootsessionuuid);
		
		if (!session)
			return false;
		
		var wallet = await _apicontrollers.getWalletFromUUID(session, walletuuid);
		
		if (!wallet)
			return false;

		var card = await wallet.getCardFromUUID(carduuid);
		
		if (!card)
			return false;
		
		if (card.isLocked())
			await card.unlock();
		
		var tokenaccount = await card.getTokenAccountFromUUID(tokenuuid);
		
		if (!tokenaccount)
			return false;
		
		var contact;
		
		if (recipientcontactuuid) {
			contact = await _apicontrollers.getContactFromUUID(session, recipientcontactuuid)
			.catch(err => {});
		}
		
		if (!contact) {
			// get a valid local contact from recipient value
			// (created on the fly if necessary, or in memory for a card)
			contact = await this._getValidLocalContact(session, wallet, recipient);
		}
		
		
		if (contact) {
			output.tocontactuuid = contact.getContactUUID();
			output.recipient = contact.getName();
			output.tocontact = await this.getContactInfo(session, contact);
		}
		
		return true;
	}
	
	// token request
	ERC20TokenRequestForm_alterForm_hook(result, params) {
		console.log('ERC20TokenRequestForm_alterForm_hook called for ' + this.name);
		
		var form = params[0];
		var cardtype = params[1];
		
		switch(cardtype) {
			case 0:
				form.recipient.placeholder += '- give first letters of contact';
				break;
			case 1:
				form.recipient.placeholder += '- first letters of local contact email';
				break;
			default:
				break;
		}
		
		result.push({module: this.name, handled: true});
		
		return true;
	}
	
	async ERC20TokenRequestForm_onRequest_asynchook(result, params) {
		console.log('ERC20TokenRequestForm_onRequest_asynchook called for ' + this.name);
		
		var global = this.global;
		var _apicontrollers = this._getClientAPI();
		
		result.push({module: this.name, handled: true});

		var input = params[0];
		var output = params[1];
		
		var rootsessionuuid = input.rootsessionuuid;
		var walletuuid = input.walletuuid;
		var carduuid = input.carduuid;
		var tokenuuid = input.tokenuuid;
		var recipient = input.recipient;
		
		var session = await _apicontrollers.getSessionObject(rootsessionuuid);
		
		if (!session)
			return false;
		
		var wallet = await _apicontrollers.getWalletFromUUID(session, walletuuid);
		
		if (!wallet)
			return false;

		var card = await wallet.getCardFromUUID(carduuid);
		
		if (!card)
			return false;
		
		if (card.isLocked())
			await card.unlock();
		
		var tokenaccount = await card.getTokenAccountFromUUID(tokenuuid);
		
		if (!tokenaccount)
			return false;
		
		
		// get a valid local contact (created on the fly if necessary, or in memory for a card)
		var contact = await this._getValidLocalContact(session, wallet, recipient);
		
		if (contact) {
			output.tocontactuuid = contact.getContactUUID();
			output.recipient = contact.getName();
			output.contact = await this.getContactInfo(session, contact);
		}
		
		// fill wallet info
		output.wallet = await this.getWalletInfo(session, wallet);
		
		// fill card info
		output.card = await this.getCardInfo(session, wallet, card);
		
		// fill scheme info
		var scheme = card.getScheme();
		output.scheme = await this.getSchemeInfo(session, scheme);
		
		// then token info
		output.token = await this.getERC20TokenAccountInfo(session, wallet, tokenaccount);
		
		return true;
	}

}

if ( (typeof GlobalClass === 'undefined') || (!GlobalClass)) {var GlobalClass = ((typeof window !== 'undefined') && window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.getGlobalObject().registerModuleObject(new Module());


//dependencies
if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.getGlobalObject().registerModuleDepency('mvc-wallet', 'common');