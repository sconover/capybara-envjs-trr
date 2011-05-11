
(function(){
    
var log = Envjs.logger();

Envjs.once('tick', function(){
    log = Envjs.logger('Envjs.Platform.HTML').
        debug('Platform Core HTML API available');    
});

/**
 * describes which script src values will trigger Envjs to load
 * the script like a browser would
 */
Envjs.scriptTypes = {
    "": true, //anonymous/inline
    "text/javascript"   :true,
    "text/envjs"        :true
};

/**
 * will be called when loading a script throws an error
 * @param {Object} script
 * @param {Object} e
 */
Envjs.onScriptLoadError = function(script, e){
    log.error('error loading script %s %s', script, e);
};

/**
 * load and execute script tag text content
 * @param {Object} script
 */
Envjs.loadInlineScript = function(script){
    if(script.ownerDocument.ownerWindow){   
        log.debug('evaulating inline in window %s', script.ownerDocument.ownerWindow);
        Envjs['eval'](
            script.ownerDocument.ownerWindow,
            script.text,
            'eval('+script.text.substring(0,16)+'...):'+new Date().getTime()
        );
    }else{
        log.debug('evaulating inline in global %s',  __this__);
        Envjs['eval'](
            __this__,
            script.text,
            'eval('+script.text.substring(0,16)+'...):'+new Date().getTime()
        );
    }
    //console.log('evaluated at scope %s \n%s',
    //    script.ownerDocument.ownerWindow.guid, script.text);
};

/**
 * Should evaluate script in some context
 * @param {Object} context
 * @param {Object} source
 * @param {Object} name
 */
Envjs['eval'] = function(context, source, name){};


/**
 * Executes a script tag
 * @param {Object} script
 * @param {Object} parser
 */
Envjs.loadLocalScript = function(script){
    var types,
        src,
        i,
        base,
        filename,
        xhr,
        brief = script.src||script.text.substring(0,64);

    log.debug("loading script type %s : %s", script.type, brief);

    if(script.type){
        types = script.type.split(";");
        for(i=0;i<types.length;i++){
            if(Envjs.scriptTypes[types[i].toLowerCase()]){
                //ok this script type is allowed
                break;
            }
            if(i+1 == types.length){
                log.debug('wont load script type %s', script.type);
                return false;
            }
        }
    }else if(!Envjs.scriptTypes['']){   
        log.debug('wont load anonymous script type ""');
        return false;
    }

    try{
        if(!script.src.length ){
            if(Envjs.scriptTypes[""]){
                log.debug('handling inline scripts %s %s', script.src, Envjs.scriptTypes[""] );
                Envjs.loadInlineScript(script);
                return true;
            }else{
                return false;
            }
        }
    }catch(e){
        log.error("Error loading script. %s", e);
        Envjs.onScriptLoadError(script, e);
        return false;
    }


    log.debug("loading allowed external script %s", script.src);

    //lets you register a function to execute
    //before the script is loaded
    if(Envjs.beforeScriptLoad){
        for(src in Envjs.beforeScriptLoad){
            if(script.src.match(src)){
                Envjs.beforeScriptLoad[src](script);
            }
        }
    }
    base = "" + script.ownerDocument.location;
    //filename = Envjs.uri(script.src.match(/([^\?#]*)/)[1], base );
    log.debug('loading script from base %s', base);
    filename = Envjs.uri(script.src, base);
    try {
        xhr = new XMLHttpRequest();
        xhr.open("GET", filename, false/*syncronous*/);
        log.debug("loading external script %s", filename);
        xhr.onreadystatechange = function(){
            log.debug("readyState %s", xhr.readyState);
            if(xhr.readyState === 4){
                Envjs['eval'](
                    script.ownerDocument.ownerWindow,
                    xhr.responseText,
                    filename
                );
            }
            log.debug('finished evaluating %s', filename);
        };
        xhr.send(null, false);
    } catch(ee) {
        log.error("could not load script %s \n %s", filename, ee );
        Envjs.onScriptLoadError(script, ee);
        return false;
    }
    //lets you register a function to execute
    //after the script is loaded
    if(Envjs.afterScriptLoad){
        for(src in Envjs.afterScriptLoad){
            if(script.src.match(src)){
                Envjs.afterScriptLoad[src](script);
            }
        }
    }
    return true;
};


/**
 * An 'image' was requested by the document.
 *
 * - During inital parse of a <link>
 * - Via an innerHTML parse of a <link>
 * - A modificiation of the 'src' attribute of an Image/HTMLImageElement
 *
 * NOTE: this is optional API.  If this doesn't exist then the default
 * 'loaded' event occurs.
 *
 * @param node {Object} the <img> node
 * @param node the src value
 * @return 'true' to indicate the 'load' succeed, false otherwise
 */
Envjs.loadImage = function(node, src) {
    return true;
};

Envjs.loadImage = function(node, value) {
    var event;
    var owner = node.ownerDocument;
    if (value) {
        // value has to be something (easy)
        // if the user-land API doesn't exist
        // Or if the API exists and it returns true, then ok:
        event = owner.createEvent('Events');
        event.initEvent('load');
    } else {
        // oops
        event = owner.createEvent('Events');
        event.initEvent('error');
    }
    node.dispatchEvent(event, false);
};

/**
 * A 'link'  was requested by the document.  Typically this occurs when:
 * - During inital parse of a <link>
 * - Via an innerHTML parse of a <link>
 * - A modificiation of the 'href' attribute on a <link> node in the tree
 *
 * @param node {Object} is the link node in question
 * @param href {String} is the href.
 *
 * Return 'true' to indicate that the 'load' was successful, or false
 * otherwise.  The appropriate event is then triggered.
 *
 * NOTE: this is optional API.  If this doesn't exist then the default
 *   'loaded' event occurs
 */
Envjs.loadLink = function(node, value) {
    var event;
    var owner = node.ownerDocument;

    if (owner.fragment) {
        /**
         * if we are in an innerHTML fragment parsing step
         * then ignore.  It will be handled once the fragment is
         * added to the real doco
         */
        return;
    }

    if (node.parentNode === null) {
        /*
         * if a <link> is parentless (normally by create a new link
         * via document.createElement('link'), then do *not* fire an
         * event, even if it has a valid 'href' attribute.
         */
        return;
    }
    if (value != '') {
        // value has to be something (easy)
        // if the user-land API doesn't exist
        // Or if the API exists and it returns true, then ok:
        event = owner.createEvent('Events');
        event.initEvent('load');
    } else {
        // oops
        event = owner.createEvent('Events');
        event.initEvent('error');
    }
    node.dispatchEvent(event, false);
};

var HTMLParser;
Envjs.exchangeHTMLDocument = function(doc, text, url) {
    var html, head, title, body, 
        event, 
        frame = doc.__ownerFrame__, 
        i;
    try {
        HTMLParser = HTMLParser || require('envjs/parser').HTMLParser;
        //do some cleanup so we can reuse the document
        doc.baseURI = url;
        log.debug('reseting document indexes');
        doc._indexes_ = {
            'ancestors' : new NodeList(doc, doc),
            '*': new NodeList(doc, doc)
        };
        //TODO: we should remove the events for the document but 
        // its so nice to setup a load handler before calling 
        // document.location
        //doc.removeEventListener('*');
        
        log.debug('parsing document for window exchange %s', url);
        HTMLParser.parseDocument(text, doc);
        
        log.debug('finsihed parsing document for window exchange %s', url);
        //if this document is inside a frame make sure to trigger
        //a new load event on the frame
        if(frame){
            event = doc.createEvent('HTMLEvents');
            event.initEvent('load', false, false);
            frame.dispatchEvent( event, false );
        }
    } catch (e) {
        log.warn('parsererror %s', e);
        try {
            log.debug('document before error\n %s', doc.documentElement.outerHTML);
        } catch (ee) {
            // swallow
        }
        doc = new HTMLDocument(new DOMImplementation(), doc.ownerWindow);
        html =    doc.createElement('html');
        head =    doc.createElement('head');
        title =   doc.createElement('title');
        body =    doc.createElement('body');
        title.appendChild(doc.createTextNode('Error'));
        body.appendChild(doc.createTextNode('' + e));
        head.appendChild(title);
        html.appendChild(head);
        html.appendChild(body);
        doc.appendChild(html);
        log.debug('default error document \n %s', doc.documentElement.outerHTML);

        //DOMContentLoaded event
        if (doc.createEvent) {
            event = doc.createEvent('Event');
            event.initEvent('DOMContentLoaded', false, false);
            doc.dispatchEvent( event, false );

            event = doc.createEvent('HTMLEvents');
            event.initEvent('load', false, false);
            doc.dispatchEvent( event, false );
        }

        //finally fire the window.onload event
        //TODO: this belongs in window.js which is a event
        //      event handler for DOMContentLoaded on document

        try {
            if (doc === window.document) {
                console.log('triggering window.load');
                event = doc.createEvent('HTMLEvents');
                event.initEvent('load', false, false);
                window.dispatchEvent( event, false );
            }
        } catch (eee) {
            log.debug('window load event failed %s', eee);
            //swallow
        }
    }
};

(function(){


/*
 *  cookie handling
 *  Private internal helper class used to save/retreive cookies
 */

/**
 * Specifies the location of the cookie file
 */
Envjs.cookieFile = function(){
    return 'file://'+Envjs.homedir+'/.cookies';
};

/**
 * saves cookies to a local file
 * @param {Object} htmldoc
 */
Envjs.saveCookies = function(){
    var cookiejson = JSON.stringify(Envjs.cookies.persistent,null,'\t');
    log.debug('persisting cookies %s', cookiejson);
    Envjs.writeToFile(cookiejson, Envjs.cookieFile());
};

/**
 * loads cookies from a local file
 * @param {Object} htmldoc
 */
Envjs.loadCookies = function(){
    var cookiejson,
        js,
        file;
    try{
        file = Envjs.cookieFile();
        log.debug('load cookies %s', file);
        cookiejson = Envjs.readFromFile(file);

        log.debug('cookies json %s', cookiejson);
        js = JSON.parse(cookiejson, null, '\t');
    }catch(e){
        log.debug('failed to load cookies %s', e);
        js = {};
    }
    return js;
};

Envjs.cookies = {
    persistent:{
        //domain - key on domain name {
            //path - key on path {
                //name - key on name {
                     //value : cookie value
                     //other cookie properties
                //}
            //}
        //}
        //expire - provides a timestamp for expiring the cookie
        //cookie - the cookie!
    },
    temporary:{//transient is a reserved word :(
        //like above
    }
};

var __cookies__;

function __domainValid__(url, value){
    var i,
        domainParts = url.hostname.split('.').reverse(),
        newDomainParts = value.split('.').reverse();
    if(newDomainParts.length > 1){
        for(i=0;i<newDomainParts.length;i++){
            if(newDomainParts[i] !== domainParts[i]){
                return false;
            }
        }
        return true;
    }
    return false;
}


function __mergeCookie__(target, cookie, properties){
    var name, now;
    if(!target[cookie.domain]){
        target[cookie.domain] = {};
    }
    if(!target[cookie.domain][cookie.path]){
        target[cookie.domain][cookie.path] = {};
    }
    for(name in properties){
        if(properties.hasOwnProperty(name)){
            now = new Date().getTime();
            target[cookie.domain][cookie.path][name] = {
                "value":properties[name],
                "secure":cookie.secure,
                "max-age":cookie['max-age'],
                "date-created":now,
                "expiration":(cookie['max-age']===0) ? 
                    0 :
                    now + cookie['max-age']
            };
        }
        //console.log('cookie is %o',target[cookie.domain][cookie.path][name]);
    }
}

//HTMLDocument cookie
Envjs.setCookie = function(url, cookie){
    var i,
        index,
        name,
        value,
        properties = {},
        attr,
        attrs;
    url = Envjs.urlsplit(url);
    if(cookie){
        attrs = cookie.split(";");
    }else{
        return;
    }
    
    //for now the strategy is to simply create a json object
    //and post it to a file in the .cookies.js file.  I hate parsing
    //dates so I decided not to implement support for 'expires' 
    //(which is deprecated) and instead focus on the easier 'max-age'
    //(which succeeds 'expires') 
    cookie = {};//keyword properties of the cookie
    cookie.domain = url.hostname;
    cookie.path = url.path||'/';
    for(i=0;i<attrs.length;i++){
        index = attrs[i].indexOf("=");
        if(index > -1){
            name = __trim__(attrs[i].slice(0,index));
            value = __trim__(attrs[i].slice(index+1));
            if(name.toLowerCase() == 'max-age'){
                //we'll have to when to check these
                //and garbage collect expired cookies
                cookie[name] = parseInt(value, 10);
            } else if( name.toLowerCase() == 'domain' ){
                if(__domainValid__(url, value)){
                    cookie.domain = value;
                }
            } else if( name.toLowerCase() == 'path' ){
                //not sure of any special logic for path
                cookie.path = value;
            } else {
                //its not a cookie keyword so store it in our array of properties
                //and we'll serialize individually in a moment
                properties[name] = value;
            }
        }else{
            if( attrs[i].toLowerCase() == 'secure' ){
                cookie[attrs[i]] = true;
            }
        }
    }
    if(!('max-age' in cookie)){
        //it's a transient cookie so it only lasts as long as 
        //the window.location remains the same (ie in-memory cookie)
        __mergeCookie__(Envjs.cookies.temporary, cookie, properties);
    }else{
        //the cookie is persistent
        __mergeCookie__(Envjs.cookies.persistent, cookie, properties);
        Envjs.saveCookies();
    }
};


function __cookieString__(cookies, url) {
    var cookieString = "",
        domain, 
        path,
        name,
        i=0;
    for (domain in cookies) {
        if (cookies.hasOwnProperty(domain) && (domain == "" || domain == url.hostname)) {
            // check if the cookie is in the current domain (if domain is set)
            log.debug('cookie domain %s', domain);
            for (path in cookies[domain]) {
                if (cookies[domain].hasOwnProperty(path) && 
                    (path == "/" || url.path.indexOf(path) > -1)) {
                    log.debug('cookie domain path %s', path);
                    // make sure path is at or below the window location path
                    for (name in cookies[domain][path]) {
                        if(cookies[domain][path].hasOwnProperty(name)){
                            log.debug('cookie domain path name %s', name);
                            cookieString += 
                                ((i++ > 0)?'; ':'') +
                                name + "=" + 
                                cookies[domain][path][name].value;
                        }
                    }
                }
            }
        }
    }
    return cookieString;
}


Envjs.getCookies = function(url){
    //The cookies that are returned must belong to the same domain
    //and be at or below the current window.location.path.  Also
    //we must check to see if the cookie was set to 'secure' in which
    //case we must check our current location.protocol to make sure it's
    //https:
    var persisted;
    url = Envjs.urlsplit(url);
    if(!__cookies__){
        try{
            __cookies__ = true;
            try{
                persisted = Envjs.loadCookies();
            }catch(ee){
                //fail gracefully
                log.debug('failed to load persistant cookies %s', ee);
            }   
            if(persisted){
                __extend__(Envjs.cookies.persistent, persisted);
            }
            log.debug('set cookies for doc %s', url);
        }catch(e){
            log.debug('cookies not loaded %s', e);
        }
    }
    var temporary = __cookieString__(Envjs.cookies.temporary, url),
        persistent =  __cookieString__(Envjs.cookies.persistent, url);
    log.debug('temporary cookies: %s', temporary);  
    log.debug('persistent cookies: %s', persistent);  
    return  temporary + persistent;
};


}());//end cookies


/**
 * Returns the value of the field element.
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If the given element is not
 * successful and the successful arg is not false then the returned value will be null.
 *
 * Note: If the successful flag is true (default) but the element is not successful, the return will be null
 * Note: The value returned for a successful select-multiple element will always be an array.
 * Note: If the element has no value the return value will be undefined.
 *
 * @name fieldValue
 * @param Element el The DOM element for which the value will be returned
 * @param Boolean successful true if value returned must be for a successful controls (default is true)
 * @type String or Array<String> or null or undefined
 */
 function __fieldValue__(element, successful) {
    var name = element.name,
        type = element.type,
        tag = element.tagName.toLowerCase(),
        index,
        array,
        options,
        option,
        one,
        i, imax,
        value;

    if (typeof successful == 'undefined')  {
        successful = true;
    }
    //console.log('element %s disabled ? %s (successful:%s)', name, element.disabled, successful);

    if (successful && (!name || element.disabled || type == 'reset' || type == 'button' ||
             (type == 'checkbox' || type == 'radio') &&  !element.checked ||
            //thatcher - todo: determine why not type == 'submit'
             (/*type == 'submit||*/ type == 'image') &&
             element.form && element.form.clk != element || tag === 'select' &&
             element.selectedIndex === -1)) {
            //console.log('skipping element in form serialization %s', element);
            return null;
    }

    if (tag === 'select') {
        index = element.selectedIndex;
        if (index < 0) {
            return null;
        }
        array = [];
        options = element.options;
        one = (type == 'select-one');
        imax = (one ? index+1 : options.length);
        i = (one ? index : 0);
        for( i; i < imax; i++) {
            option = options[i];
            if (option.selected) {
                value = option.value;
                if (one) {
                    return value;
                }
                array.push(value);
            }
        }
        return array;
    }
    return element.value;
}


// Serialize an array of key/values into a query string
function __param__( array ) {
    var i, serialized = [];

    // Serialize the key/values
    for(i=0; i<array.length; i++){
        serialized[ serialized.length ] =
            encodeURIComponent(array[i].name) + '=' +
            encodeURIComponent(array[i].value);
    }

    // Return the resulting serialization
    return serialized.join("&").replace(/%20/g, "+");
}

/**
 * Serializes all field elements inputs Array into a query string.
 * This method will return a string in the format: name1=value1&amp;name2=value2
 *
 * The successful argument controls whether or not serialization is limited to
 * 'successful' controls (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.
 *
 *
 * @name fieldSerialize
 * @param successful true if only successful controls should be serialized (default is true)
 * @type String
 */
function __fieldSerialize__(inputs, successful) {
    var array = [],
        input,
        name,
        value,
        i,j, imax, jmax;

    imax = inputs.length;
    for(i=0; i<imax; i++){
        input = inputs[i];
        name = input.name;
        if (!name) {
            return '';
        }
        value = __fieldValue__(input, successful);
        if (value && value.constructor == Array) {
            jmax = value.length;
            for (j=0; j < jmax; j++){
                array.push({
                    name: name,
                    value: value[j]
                });
            }
        }else if (value !== null && typeof value != 'undefined'){
            array.push({
                name: input.name,
                value: value
            });
        }
    }

    //hand off  for proper encoding
    return __param__(array);
}

/**
 * Form Submissions
 *
 * This code is borrow largely from jquery.params and jquery.form.js
 *
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * ajaxSubmit() and ajaxForm() methods.
 *
 * The semantic argument can be used to force form serialization in semantic order.
 * This is normally true anyway, unless the form contains input elements of type='image'.
 * If your form must be submitted with name/value pairs in semantic order and your form
 * contains an input of type='image" then pass true for this arg, otherwise pass false
 * (or nothing) to avoid the overhead for this logic.
 *
 *
 * @name formToArray
 * @param semantic true if serialization must maintain strict semantic ordering of elements (slower)
 * @type Array<Object>
 */
function __formToArray__(form, semantic) {
    var array = [],
        elements = semantic ? form.getElementsByTagName('*') : form.elements,
        element,
        i,j,imax, jmax,
        name,
        value;

    if (!elements) {
        return array;
    }

    imax = elements.length;
    for(i=0; i < imax; i++) {
        element = elements[i];
        name = element.name;
        if (!name) {
            continue;
        }
        log.debug('serializing input %s', name);
        if (semantic && form.clk && element.type === "image") {
            // handle image inputs on the fly when semantic == true
            if(!element.disabled && form.clk == element) {
                array.push({
                    name: name+'.x',
                    value: form.clk_x
                },{
                    name: name+'.y',
                    value: form.clk_y
                });
            }
            continue;
        }

        value = __fieldValue__(element, true);
        log.debug('input value is %s', value);
        if (value && value.constructor == Array) {
            jmax = value.length;
            for(j=0; j < jmax; j++){
                array.push({name: name, value: value[j]});
            }
        } else if (value !== null && typeof value != 'undefined'){
            log.debug('serializing form %s %s', name, value);
            array.push({name: name, value: value});
        }
    }

    if (!semantic && form.clk) {
        // input type=='image' are not found in elements array! handle them here
        elements = form.getElementsByTagName("input");
        imax = imax=elements.length;
        for(i=0; i < imax; i++) {
            element = elements[i];
            name = element.name;
            if(name && !element.disabled && element.type == "image") {
                array.push(
                    {name: name+'.x', value: form.clk_x},
                    {name: name+'.y', value: form.clk_y});
            }
        }
    }
    return array;
}


/**
 * Serializes form data into a 'submittable' string. This method will return a string
 * in the format: name1=value1&amp;name2=value2
 *
 * The semantic argument can be used to force form serialization in semantic order.
 * If your form must be submitted with name/value pairs in semantic order then pass
 * true for this arg, otherwise pass false (or nothing) to avoid the overhead for
 * this logic (which can be significant for very large forms).
 *
 *
 * @name formSerialize
 * @param semantic true if serialization must maintain strict semantic ordering of elements (slower)
 * @type String
 */
function __formSerialize__(form, semantic) {
    //hand off to param for proper encoding
    return __param__(__formToArray__(form, semantic));
}

Envjs.serializeForm = __formSerialize__;


/**
 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
 *
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If this value is false the value(s)
 * for each element is returned.
 *
 * Note: This method *always* returns an array.  If no valid value can be determined the
 *       array will be empty, otherwise it will contain one or more values.
 *
 *
 * @name fieldValue
 * @param Boolean successful true if only the values for successful controls
 *        should be returned (default is true)
 * @type Array<String>
 */
 function __fieldValues__(inputs, successful) {
    var i,
        imax = inputs.length,
        element,
        values = [],
        value;
    for (i=0; i < imax; i++) {
        element = inputs[i];
        value = __fieldValue__(element, successful);
        if (value === null || typeof value == 'undefined' ||
            (value.constructor == Array && !value.length)) {
            continue;
        }
        if (value.constructor == Array) {
            Array.prototype.push(values, value);
        } else {
            values.push(value);
        }
    }
    return values;
}

/**
 * Clears the selected form element.  Takes the following actions on the element:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 *
 * @name clearFields
 */
 function __clearField__(element) {
    var type = element.type,
        tag = element.tagName.toLowerCase();
    if (type == 'text' || type == 'password' || tag === 'textarea') {
        element.value = '';
    } else if (type == 'checkbox' || type == 'radio') {
        element.checked = false;
    } else if (tag === 'select') {
        element.selectedIndex = -1;
    }
}


/**
 * Clears the form data.  Takes the following actions on the form's input fields:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 *
 *
 * @name clearForm
 */
 function __clearForm__(form) {
    var i,
        j, jmax,
        elements,
        resetable = ['input','select','textarea'];
    for(i=0; i<resetable.length; i++){
        elements = form.getElementsByTagName(resetable[i]);
        jmax = elements.length;
        for(j=0;j<jmax;j++){
            __clearField__(elements[j]);
        }
    }
}




}(/*Envjs.Platform.HTML*/));
