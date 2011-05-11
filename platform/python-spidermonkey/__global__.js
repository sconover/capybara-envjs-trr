var __context__ = __this__;

var Envjs = Envjs || 
	require('envjs/platform/core').Envjs;
	require('local_settings');

Envjs.platform       = "SpyderMonkey";
Envjs.revision       = sys.version.substring(0,5);

Envjs.argv = []
for(var i in sys.argv){
    Envjs.argv.push(sys.argv[i]);
}
Envjs.argv.shift();
Envjs.argv.shift();

Envjs.exit = function(){ 
	exit(); 
};
