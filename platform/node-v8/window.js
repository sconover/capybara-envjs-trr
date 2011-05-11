
//Since we're running in v8 I guess we can safely assume
//java is not 'enabled'.  I'm sure this requires more thought
//than I've given it here
Envjs.javaEnabled 	 = false;

Envjs.homedir        = process.env["HOME"];
Envjs.tmpdir         = process.env["TMPDIR"];
Envjs.os_name        = process.platform;
Envjs.os_arch        = "os arch";
Envjs.os_version     = "os version";
Envjs.lang           = process.env["LANG"];


Envjs.gc = function(){ return; };

/**
 * Makes an object window-like by proxying object accessors
 * @param {Object} scope
 * @param {Object} parent
 */
Envjs.proxy = function(scope, parent) {
    try{
        if(scope.toString() == global){
            return __this__;
        }else{
            return scope;
        }
    }catch(e){
       console.log('failed to init standard objects %s %s \n%s', scope, parent, e);
    }

};