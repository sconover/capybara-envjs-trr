
Envjs.log = function(msg){
	Ruby.puts(msg);
}

Envjs.lineSource = function(e){
    return "(line ?)";
};

Envjs.readConsole = function(){
     return Ruby.$stdin.gets();
};

Envjs.prompt = function(){
    Ruby.$stdout.write(Envjs.CURSOR+' ');
    Ruby.$stdout.flush;
};

//No REPL for
Envjs.repl = function(){
    console.log('Envjs REPL Not Available');
};
