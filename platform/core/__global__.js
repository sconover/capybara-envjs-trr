/*
 * Envjs @VERSION@
 * Pure JavaScript Browser Environment
 * By John Resig <http://ejohn.org/> and the Envjs Team
 * Copyright 2008-2010 John Resig, under the MIT License
 */
Envjs = exports.Envjs = function(){
    var i,
        override = function(){
            for(i=0;i<arguments.length;i++){
                for ( var name in arguments[i] ) {
					if(arguments[i].hasOwnProperty(name)){
                        var g = arguments[i].__lookupGetter__(name),
                            s = arguments[i].__lookupSetter__(name);
                        if ( g || s ) {
                            if ( g ) { Envjs.__defineGetter__(name, g); }
                            if ( s ) { Envjs.__defineSetter__(name, s); }
                        } else {
                            Envjs[name] = arguments[i][name];
                        }
					}
                }
            }
        };

    if(arguments.length === 1 && typeof(arguments[0]) == 'string'){
        window.location = arguments[0];
    }else if (arguments.length === 1 && typeof(arguments[0]) == "object"){
        override(arguments[0]);
    }else if(arguments.length === 2 && typeof(arguments[0]) == 'string'){
        override(arguments[1]);
        window.location = arguments[0];
    }
    return;
};

var log = {
    debug: function(){return this;},
    info: function(){return this;},
    warn: function(){return this;},
    error: function(){return this;},
    exception: function(){return this;}
};

try{
	console = console;
}catch(e){ 
	console = require('envjs/console').console;
}
	
//eg "Mozilla"
Envjs.appCodeName  = "Envjs";

//eg "Gecko/20070309 Firefox/2.0.0.3"
Envjs.appName      = "Netscape";

Envjs.version = "1.618";//
Envjs.revision = '';

Envjs.exit = function(){};


