'use strict';

class Controllers {
	constructor(global) {
		this.global = global;
		this.app = null;
	}
	
	getAppObject() {
		return this.app;
	}
	
	setAppObject(app) {
		this.app = app;
	}
	
	// functions called by modules to change ui state
	gotoHome() {
		if (this.app)
			this.app.gotoHome();
	}
	
	gotoLoginPage() {
		if (this.app)
			this.app.gotoLoginPage();
	}
	
	refreshPage() {
		if (this.app)
			this.app.refreshPage();
	}
	
}

if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('mvc', 'Controllers', Controllers);
else if (typeof window !== 'undefined') {
	let _GlobalClass = ( window && window.simplestore && window.simplestore.Global ? window.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('mvc', 'Controllers', Controllers);
}
else if (typeof global !== 'undefined') {
	// we are in node js
	let _GlobalClass = ( global && global.simplestore && global.simplestore.Global ? global.simplestore.Global : null);
	
	_GlobalClass.registerModuleClass('mvc', 'Controllers', Controllers);
}