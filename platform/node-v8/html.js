var Script = process.binding('evals').Script;

Envjs.eval = function(context, source, name, warming){
	if(context === global){
		return warming ? 
			eval(source) :
			Script.runInThisContext(source, name);
	}else{
		return Script.runInNewContext(source, context, name);
	}
};
