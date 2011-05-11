
/**
 * synchronizes thread modifications
 * @param {Function} fn
 */
 Envjs.sync = function(fn){
     //console.log('Threadless platform, sync is safe');
     return sync(fn);
 };

 Envjs.spawn = function(fn){
     return spawn(fn);
 };

/**
 * sleep thread for specified duration
 * @param {Object} milliseconds
 */
Envjs.sleep = function(milliseconds){
	return Ruby.sleep(1.0*milliseconds/1000.0);
};