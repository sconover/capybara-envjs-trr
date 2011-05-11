(function(){
    
var log = Envjs.logger('Envjs.Platform.Johnson');

Envjs.eval = function(context, source, name){
    if(context == __this__){
        return global.evaluate( source, name );
    }else{
		var abc = new Ruby.Johnson.Runtime()
		log.debug('evaluating in framed context %s %s', context, abc);
	    return context.evaluate( source, name );
    }
};

})();