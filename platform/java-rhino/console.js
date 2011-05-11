
/**
 * Writes message to system out.
 *
 * @param {Object} message
 */
(function(){
	
Envjs.log = print;

Envjs.lineSource = function(e){
    return e&&e.rhinoException?e.rhinoException.lineSource():"(line ?)";
};

var $in, log; 
Envjs.readConsole = function(){
	log = log||Envjs.logger('Envjs.Rhino');
	$in = $in||new java.io.BufferedReader(
		new java.io.InputStreamReader(java.lang.System['in'])
	);
	return  $in.readLine()+'';
};
Envjs.prompt = function(){
  	java.lang.System.out.print(Envjs.CURSOR+' '); 
	java.lang.System.out.flush();
};

}());

