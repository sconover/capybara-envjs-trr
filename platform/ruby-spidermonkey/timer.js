
/**
 * synchronizes thread modifications
 * @param {Function} fn
 */	
var	lock = new Ruby.Mutex();

//NOTES:
//context['sync'] = lambda{|wrapper| 
//    Proc.new{|*args|lock.synchronize {wrapper['fn'].call(*args)}} 
//}
//context['sync']      = lambda{|fn| Proc.new{|*args| fn.call(*args) }}
Envjs.sync = function(fn){
    //console.log('syncing js fn %s', fn);
    var wrapper = {fn:fn};
	//return lock.synchronize(fn)
    return fn;
};

//NOTES:
//context['spawn']    = lambda{|wrapper| Thread.new {wrapper['fn'].call} }
//context['spawn']     = lambda{|wrapper| wrapper['fn'].call }
 Envjs.spawn = function(fn){
     //console.log('spawning js fn %s', fn);
     var wrapper = {fn:fn};
     return fn();
 };

/**
 * sleep thread for specified duration
 * @param {Object} milliseconds
 */
Envjs.sleep = function(milliseconds){
	return Ruby.sleep(1.0*milliseconds/1000.0);
};
