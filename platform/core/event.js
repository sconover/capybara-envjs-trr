(function(){
/**
 *  The main event loop is unrelated to html/dom events
 */
var log;

var eventListeners = {
        newListener:[],
        tick:[],
        exit:[]
    },
    eventQueue = [];
    
Envjs.eventLoop = Envjs.eventLoop || function(){
    log = log||Envjs.logger('Envjs.Core');
    while(true) {
        Envjs.tick();
    }
};

Envjs.on = function(event, callback){
    if(!(event in eventListeners)){
        eventListeners[event] = [];
    }
    eventListeners[event].push(callback);
};

Envjs.once = function(event, callback){
    var once = function(){
        Envjs.removeListener(event, once);
        callback.apply(callback, arguments);
    };
    Envjs.on(event, once);
};

Envjs.removeListener = function(event, callback){
    if(!(event in eventListeners)){
        return;
    }
    var index = eventListeners[event].indexOf(callback);
    if(index > -1){
        eventListeners[event].splice(index, 1);
    }
};

Envjs.removeAllListeners = function(event){
    eventListeners[event] = [];
};

Envjs.listeners = function(event){
    return (event in eventListeners) ?
        eventListeners[event] : [];
};

Envjs.emit = function(event /*, arg1, arg2, etc*/ ){
    eventQueue.push({event:event, args:arguments});
};

setTimeout  = require('envjs/timer').setTimeout;

var $warming = 10;

Envjs.tick = function(){
    var y, next, fn, arg, file; 
    log = log||Envjs.logger('Envjs.Core');
    
    log.debug('go through %s events', eventQueue.length);
    next = eventQueue.shift();
    while( next ){
        
        log.debug('next event %s', next.event);
        if(next.event in eventListeners){

            if('exit' === next.event){
                log.info('exiting');
                Envjs.exit();
            }
            for(y = 0; y < eventListeners[next.event].length; y++){
                log.debug('event %s %s', y, next.event);
                fn = eventListeners[next.event][y];
                fn.apply(fn, next.args);
            }
        }
        next = eventQueue.shift();
    }
    if(!$warming && Envjs.argv && Envjs.argv.length){
        
        log.debug('parsing args %s',  Envjs.argv);
        arg = Envjs.argv.shift();
        if(arg && typeof(arg) == 'string'){
            file = arg;
            log.debug('will load file %s next', file);
            setTimeout(function(){
                log.debug('loading script %s', file);
                Envjs['eval'](__this__, Envjs.readFromFile(file), file, !$warming);
            },1);
        }

    }else if($warming === 0 && Envjs.argv.length === 0){
        $warming = false;
        //prevents repl from being opened twice
        //Envjs.repl();
    }else if($warming){  
        log.debug('warming');
        $warming--;
    }
    
    if($warming === false && !eventQueue.length && !Envjs.connections.length && !Envjs.timers.length ){
        log.debug('ready to exit warming %s eventQueue %s connections %s timers %s',
            $warming,
            eventQueue.length,
            Envjs.connections.length,
            Envjs.timers.length
        );  
        log.info('event loop is passive, exiting');
        Envjs.emit('exit');
    }
        
    Envjs.emit('tick', Date.now());
    Envjs.sleep(4);
};


/**
 * Used in ./event/eventtarget.js  These are DOM related events
 * @param {Object} event
 */
Envjs.defaultEventBehaviors = {
    'submit': function(event) {
        var target = event.target,
            serialized,
            method,
            action;
        while (target && target.nodeName !== 'FORM') {
            target = target.parentNode;
        }
        if (target && target.nodeName === 'FORM') {
            serialized = Envjs.serializeForm(target);
            //console.log('serialized %s', serialized);
            method = target.method?target.method.toUpperCase():"GET";
            
            action = Envjs.uri(
                target.action !== ""?target.action:target.ownerDocument.baseURI,
                target.ownerDocument.baseURI
            );
            if(method=='GET' && !action.match(/^file:/)){
                action = action + "?" + serialized;
            }
            //console.log('replacing document with form submission %s', action);
            target.ownerDocument.location.replace(
                action, method, serialized
            );
        }
    },
    
    'click': function(event) {
        //console.log("handling default behavior for click %s", event.target);
        var target = event.target,
            url,
            form,
            inputs;
        while (target && target.nodeName !== 'A' && target.nodeName !== 'INPUT') {
            target = target.parentNode;
        }
        if (target && target.nodeName === 'A') {
            //console.log('target is a link');
            if(target.href && !target.href.match(/^#/)){
                url = Envjs.uri(target.href, target.ownerDocument.baseURI);
                target.ownerDocument.location.replace(url);
            }
        }else if (target && target.nodeName === 'INPUT') {  
            //console.log('input %s', target.xml);
            if(target.type.toLowerCase() === 'submit'){
                if(!target.value){
                    target.value = 'submit';
                }
                //console.log('submit click %s %s', target.name, target.value);
                form = target.parentNode;
                while (form && form.nodeName !== 'FORM' ) {
                    form = form.parentNode;
                }
                if(form && form.nodeName === 'FORM'){
                    //disable other submit buttons before serializing
                    inputs = form.getElementsByTagName('input');
                    for(var i=0;i<inputs.length;i++){
                        //console.log('checking for non-relevant submit buttons %s', inputs[i].name);
                        if(inputs[i].type == 'submit' && inputs[i]!=target){
                            //console.log('disabling the non-relevant submit button %s', inputs[i].value);
                            inputs[i].disabled = true;
                            inputs[i].value = null;
                        }
                    }
                    form.submit();
                }
            }
        }
    }
};

}(/*Envjs.Platform.Core*/));
