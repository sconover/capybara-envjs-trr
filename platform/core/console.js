

/**
 * Writes message to system out
 * @param {String} message
 */
Envjs.log = function(message){};

/**
 * Prints stack trace of current execution point
 */
Envjs.trace = function(){};

/**
 * Writes error info out to console
 * @param {Error} e
 */
Envjs.lineSource = function(e){};

/**
 * Provides prompt to system stdout
 * @param {Error} e
 */
Envjs.prompt = function(e){};

/**
 * Reads line from system stdin
 * @param {Error} e
 */
Envjs.readConsole = function(e){};

/**
 * Starts a read-eval-print-loop
 */
Envjs.repl = function(){
    var line, 
        waiting,
		$_ = null;
    var log = Envjs.logger('Envjs.Core.REPL');
    Envjs.on('tick', function(){
        log.debug('tick for REPL');
        if(!waiting){
            log.debug('not waiting in REPL');
            waiting = true;
            Envjs.prompt();
            log.debug('waiting for line in');
            Envjs.spawn(function(){
                log.info('async waiting for line in');
                line = Envjs.readConsole();
                if(line === "quit" || line === "exit") {
                    log.info('%sting', line);
                    Envjs.emit('exit', 'repl');
                }else{
                    setTimeout(function(){
                        try{
                            if(line){
                                log.info('evaluating console line in: %s', line);
                                $_ = Envjs['eval'](__this__, line);
                                if($_!==undefined){
                                    log.info('result of evaluation: %s', $_);
                                    Envjs.log( $_ );
                                }
                             }else{
                                log.info('not evaluating console line in: %s', line);
                             }
                        }catch(e) {
                            Envjs.log('[Envjs.REPL Error] ' + e);
                        }finally{
                            waiting = false;
                        }   
                    },1);
                }
            });
        }else{
            log.debug('waiting in REPL');
        }
    });
};

Envjs.CURSOR = "envjs>";

    