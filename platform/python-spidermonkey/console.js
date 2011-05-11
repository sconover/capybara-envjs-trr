Envjs.log = print;

Envjs.lineSource = function(e){
    return "(line ?)";
};

Envjs.readConsole = function(){
     return sys.stdin.readline();
};

Envjs.prompt = function(){
    sys.stdout.write(Envjs.CURSOR+' ');
    sys.stdout.flush();
};

//No REPL for
Envjs.repl = function(){
    console.log('Envjs REPL Not Available');
};
