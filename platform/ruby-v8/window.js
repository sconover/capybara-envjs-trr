
//Since we're running in spydermonkey I guess we can safely assume
//java is not 'enabled'.  I'm sure this requires more thought
//than I've given it here
Envjs.javaEnabled 	 = false;

Envjs.homedir        = Ruby.ENV.HOME
Envjs.tmpdir         = Ruby.ENV.TMPDIR;
Envjs.os_name        = Ruby.CONFIG.host_os;
Envjs.os_arch        = Ruby.CONFIG.host_cpu;
Envjs.os_version     = "";//part of os_arch
Envjs.lang           = Ruby.ENV.LANG;

Envjs.gc = function(){ Ruby.gc(); };

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
            return new_context();
        }
    }catch(e){
        console.log('failed to init standard objects %s %s \n%s', scope, parent, e);
    }

};
