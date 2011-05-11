
/**
 * synchronizes thread modifications
 * @param {Function} fn
 */
Envjs.sync = function(fn){
    /*return function(){
        try{
           //console.log('locking');
           $lock.acquire();
           fn.apply(fn, arguments);
        }catch(e){
            console.log('error in sync: %s',e);
        }finally{
           //console.log('unlocking');
           $lock.release();
        }
    }*/
    return fn;
};

Envjs.spawn = function(fn){
    /*var t = threading.Thread();
    t.run = function(){
        try{
            console.log('spawned');
            fn.apply(fn, arguments);
        }catch(e){
            console.error(e);
        }
    }
    return t.start();*/
	fn();
 };

/**
 * sleep thread for specified duration
 * @param {Number} milliseconds
 */
Envjs.sleep = function(milliseconds){
	return time.sleep(1.0*milliseconds/1000.0);
};
