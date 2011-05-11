
(function(){
    
var log = Envjs.logger();

Envjs.once('tick', function(){
    log = Envjs.logger('Envjs.Platform.Timer').
        debug('Platform Core Timer API available');    
});

/**
 * synchronizes thread modifications
 * @param {Function} fn
 */
Envjs.sync = function(fn){return fn;};

/**
 * sleep thread for specified duration
 * @param {Object} milliseconds
 */
Envjs.sleep = function(milliseconds){};

/**
 * run function in another thread
 * @param {Function} fn
 */
Envjs.spawn = function(fn){};

/**
 *
 * @param {Object} fn
 * @param {Object} onInterupt
 */
Envjs.runAsync = function(fn, onInterupt){
    log.debug("running function async");
    var running = true,
        run;

    try{    
        log.debug('spawning synced function');
        return Envjs.spawn(fn);
    }catch(e){
        log.error("error while running async operation", e);
        try{
            if(onInterupt){
                onInterupt(e);
            }
        }catch(ee){}
    }
};


Envjs.timers = [];

// html5 says this should be at least 4
Envjs.MIN_TIMER_TIME = 4;

//static
Envjs.normalizeTime = function(time) {
    time = time*1;
    if ( isNaN(time) || time < 0 ) {
        time = 0;
    }

    if ( time < Envjs.MIN_TIMER_TIME ) {
        time = Envjs.MIN_TIMER_TIME;
    }
    return time;
};


Envjs.timers.addTimerOrInterval = Envjs.sync(function(fn, time, timerOrInterval){
    // this is Envjs.timers so this function is safe to call from threads
    // and more specifically setTimeout/setInterval should be safe to use 
    // from threads
    var id = Envjs.guid();
    //console.log('setting %s %s %s', timerOrInterval, time, fn);
    time = Envjs.normalizeTime(time);
    Envjs.timers.push({
        type: timerOrInterval,
        time: time,
        at: Date.now() + time,
        fn: (typeof fn == 'string') ? new Function(fn) : fn,
        id: id
    });
    return id;
});

Envjs.timers.removeTimerOrInterval = Envjs.sync(function(id, timerOrInterval){
    // this is Envjs.timers so this function is safe to call from threads
    // and more specifically clearTimeout/clearInterval should be safe to 
    // use from threads
    var i;
    //console.log("clearing %s %s", timerOrInterval, id);
    for(i = 0; i < Envjs.timers.length; i++){
        if(Envjs.timers[i].id === id){
            Envjs.timers.splice(i,1);
            break;
        }
    }
    return; 
});


Envjs.on('tick', function(type, now){
    //this is a nice simple implementation 
    var callbacks = [],
        timers = Envjs.timers,
        timer,
        i;
    //console.log('handling %s timer(s) in tick', timers.length);
    for(i = 0; i < timers.length;){
        timer = timers[i];
        //console.log('scheduled for %s , currently %s', timer.at, now);
        if(timer.at <= now){
            //console.log('timer past due: at(%s), now(%s), type(%s)',timer.at, now, timer.type);
            switch(timer.type){
            case 'timeout':
                //we need to remove it from the timers list and add it to the callback list
                callbacks.push.apply(callbacks, timers.splice(i,1));
                //dont increment the counter since the timers array was spliced
                break;
            case 'interval':
                //we need to add it to the callback list but leave it in the timers list
                callbacks.push(timer);
                //fall through to increament the counter since the timers array is unchanged
                i++;
                break;
            default:
                i++;
            }
        }else{
            //timer isnt read for execution so just leave it be
            i++;
        }
    }   
    //console.log('timer tick has %s callbacks', callbacks.length);
    //finally we need to execute the callbacks in the order added to this stack
    for(i = 0; i < callbacks.length; i++){
        timer = callbacks[i];
        timer.fn.apply(timer.fn,[]);
    }
});

//DEPRECATED
Envjs.wait = Envjs.wait||function(wait) {};

}());

