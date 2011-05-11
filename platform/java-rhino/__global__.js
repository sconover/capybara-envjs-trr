/*
 * Envjs @VERSION@
 * Pure JavaScript Browser Environment
 * By John Resig <http://ejohn.org/> and the Envjs Team
 * Copyright 2008-2010 John Resig, under the MIT License
 */

var Envjs = Envjs || 
	require('envjs/platform/core').Envjs;
	require('local_settings');

var __context__ = Packages.org.mozilla.javascript.Context.getCurrentContext();

Envjs.platform       = "Rhino";
Envjs.revision       = "1.7.0.rc2";
Envjs.argv = [];
if(__argv__ && __argv__.length){
	for(var i = 0; i < __argv__.length; i++){
		Envjs.argv[i] = __argv__[i];
	}
}

Envjs.exit = function(){
	java.lang.System.exit(0);
};
