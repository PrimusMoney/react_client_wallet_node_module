'use strict';


var Module = class {
	
	constructor() {
		this.name = 'mvc-mytokens';
		
		this.global = null; // put by global on registration
		this.app = null;
		
		this.controllers = null;

		this.isready = false;
		this.isloading = false;
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

		var modulescriptloader = parentscriptloader.getChildLoader('mvcmytokensloader');

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
		
		// initialization
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
	
	//
	// hooks
	//
	
	

}

if ( (typeof GlobalClass === 'undefined') || (!GlobalClass)) {var GlobalClass = ((typeof window !== 'undefined') && window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.getGlobalObject().registerModuleObject(new Module());


//dependencies
if ( typeof GlobalClass !== 'undefined' && GlobalClass )
GlobalClass.getGlobalObject().registerModuleDepency('mvc-mytokens', 'common');