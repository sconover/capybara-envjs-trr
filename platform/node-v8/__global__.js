var __context__ = __this__ = global;

var Envjs = Envjs || 
	require('envjs/platform/core').Envjs;
	require('local_settings');

Envjs.platform       = "Node";
Envjs.revision       = process.version;

/*process.on('uncaughtException', function (err) {
  	console.log('Envjs Caught exception: %s \n %s', err);
});*/

Envjs.argv = process.argv;
Envjs.argv.shift();
Envjs.argv.shift();//node is argv[0] but we want to start at argv[1]

Envjs.exit = function(){
    /*setTimeout(function () {
        if(!Envjs.timers.length){
            //console.log('no timers remaining %s', Envjs.timers.length);
            process.exit();
        }else{
            Envjs.exit();
        }
    }, 13);*/
};

