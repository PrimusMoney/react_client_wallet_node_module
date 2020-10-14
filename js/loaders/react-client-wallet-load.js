console.log('client-wallet-load.js loader');

var Bootstrap = window.simplestore.Bootstrap;
var ScriptLoader = window.simplestore.ScriptLoader;

var bootstrapobject = Bootstrap.getBootstrapObject();
var rootscriptloader = ScriptLoader.getRootScriptLoader();

var globalscriptloader = ScriptLoader.findScriptLoader('globalloader')

var xtrascriptloader = globalscriptloader.getChildLoader('clientwalletconfig');

// client modules
rootscriptloader.push_import(xtrascriptloader,'../../imports/includes/modules/module.js')
import '../../imports/includes/modules/module-load.js';


xtrascriptloader.load_scripts();