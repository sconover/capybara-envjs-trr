
Envjs.log = function(msg){
	Ruby.puts(msg);
};

Envjs.lineSource = function(e){
    return "(line ?)";
};

var line = "";
Envjs.readConsole = function(){
	try{
		line = Ruby.$stdin.gets();
	}catch(e){
		console.log('ERROR : %s', e);
	}
	return line;
};

Envjs.prompt = function(){
  	Ruby.$stdout.write(Envjs.CURSOR+' ');
	Ruby.$stdout.flush;
};

//No REPL for
Envjs.repl = function(){
	console.log('Envjs REPL Not Available');
};
