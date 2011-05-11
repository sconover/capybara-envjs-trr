Envjs.wait = function(){ return; }

var $tick = function(){
    process.nextTick(function () {
        //console.log('node tick');
        Envjs.tick();
        $tick();
    });
};
    
Envjs.eventLoop = function(){
    //console.log('event loop');
    $tick();
};
/**
 * provides callback hook for when the system exits
 */
Envjs.onExit = function(callback){
    process.on('exit', callback);
};


/**
 * synchronizes thread modifications
 * @param {Function} fn
 */
 Envjs.sync = function(fn){
     //console.log('syncing js fn %s', fn);
     return fn;
 };

 Envjs.spawn = function(fn){
     return fn();
 };

/**
 * sleep thread for specified duration
 * @param {Object} milliseconds
 */
Envjs.sleep = function(milliseconds){
    return;
};

