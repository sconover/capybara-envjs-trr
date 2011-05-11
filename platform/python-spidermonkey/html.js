
Envjs.eval = function(context, source, name){
    if(context == __this__){
        return global.execute( source );
    }else{
	    return context.execute( source );
    }
};
