console.log('client-wallet-load.js loader');

var Bootstrap = window.simplestore.Bootstrap;
var ScriptLoader = window.simplestore.ScriptLoader;

var bootstrapobject = Bootstrap.getBootstrapObject();
var rootscriptloader = ScriptLoader.getRootScriptLoader();

var globalscriptloader = ScriptLoader.findScriptLoader('globalloader')

var xtrascriptloader = globalscriptloader.getChildLoader('reactclientwalletconfig');

// client modules
rootscriptloader.push_import(xtrascriptloader,'../../imports/includes/module-load.js')
import '../../imports/includes/module-load.js';


xtrascriptloader.load_scripts();