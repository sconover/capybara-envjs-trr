
(function(){

var log = Envjs.logger('Envjs.HTML.Rhino');

Envjs.eval = function(context, source, name){
    //console.log('evaluating javascript source %s', source.substring(0,64));
	return  __context__.evaluateString(
        context,
        source,
        name,
        0,
        null
    );
};

}());