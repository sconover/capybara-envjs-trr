(function(){
    
var log = Envjs.logger('Envjs.Platform.RubyRacer');

Envjs.eval = function(context, source, name){
    if(context == __this__){
        return __this__.eval( source );
    }else{
		log.debug('evaluating in proxy scope %s', context);
	    return context.eval( source );
    }
};

})();