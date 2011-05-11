
var $print = require('sys').print;

Envjs.log = function(msg){
    console.log(msg+'\n\n');
};

Envjs.lineSource = function(e){
    return "(line ?)";
};

Envjs.readConsole = function(){
     return $stdin.gets();
};

Envjs.prompt = function(){
    $stdout.write(Envjs.CURSOR+' ');
    $stdout.flush;
};

//No REPL for
Envjs.repl = function(){
    //require('repl').start(Envjs.CURSOR+' ');
    console.log('Envjs REPL Not Available');
};
