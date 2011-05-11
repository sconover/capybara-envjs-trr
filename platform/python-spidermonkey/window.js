
//Since we're running in spydermonkey I guess we can safely assume
//java is not 'enabled'.  I'm sure this requires more thought
//than I've given it here
Envjs.javaEnabled = false;

Envjs.homedir        = os.environ['HOME']
Envjs.tmpdir         = os.environ['TMPDIR'];
Envjs.os_name        = platform.system();
Envjs.os_arch        = platform.processor();
Envjs.os_version     = platform.release();
Envjs.lang           = os.environ['LANG'];


Envjs.gc = function(){ global.gc(); };

/**
 * Makes an object window-like by proxying object accessors
 * @param {Object} scope
 * @param {Object} parent
 */
Envjs.proxy = function(scope, parent) {
    try{
        if(scope == __this__){
            return scope;
        }else{
            return new_global();
        }
    }catch(e){
        console.log('failed to init standard objects %s %s \n%s', scope, parent, e);
    }

};
