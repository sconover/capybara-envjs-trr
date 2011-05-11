
(function(){

var log = Envjs.logger();

Envjs.once('tick', function(){
    log = Envjs.logger('Envjs.XMLHttpRequest.Core').
        debug('XMLHttpRequest.Core available');    
});

/**
 * getcwd - named after posix call of same name (see 'man 2 getcwd')
 *
 */
Envjs.getcwd = function() {
    return Envjs.uri('.');
};

/**
 * resolves location relative to doc location
 *
 * @param {Object} path  Relative or absolute URL
 * @param {Object} base  (semi-optional)  The base url used in resolving "path" above
 */
Envjs.uri = function(path, base) {
    //console.log('constructing uri from path %s and base %s', path, base);
    path = path+'';
    // Semi-common trick is to make an iframe with src='javascript:false'
    //  (or some equivalent).  By returning '', the load is skipped'
    var js = 'javascript';
    if (path.indexOf(js+':') === 0) {
        return '';
    }

    // if path is absolute, then just normalize and return
    if (path.match('^[a-zA-Z]+://')) {
        return urlparse.urlnormalize(path);
    }

    // interesting special case, a few very large websites use
    // '//foo/bar/' to mean 'http://foo/bar'
    if (path.match('^//')) {
        path = 'http:' + path;
    }

    // if base not passed in, try to get it from document
    // Ideally I would like the caller to pass in document.baseURI to
    //  make this more self-sufficient and testable
    if (!base && document) {
        base = document.baseURI;
    }

    // about:blank doesn't count
    if (base === 'about:blank'){
        base = '';
    }

    // if base is still empty, then we are in QA mode loading local
    // files.  Get current working directory
    if (!base) {
        base = 'file://' +  Envjs.getcwd() + '/';
    }
    // handles all cases if path is abosulte or relative to base
    // 3rd arg is "false" --> remove fragments
    var newurl = urlparse.urlnormalize(urlparse.urljoin(base, path, false));
    //console.log('uri %s %s = %s', base, path, newurl);
    return newurl;
};


/**
 * Used to write to a local file
 * @param {Object} text
 * @param {Object} url
 */
Envjs.writeToFile = function(text, url){};


/**
 * Used to write to a local file
 * @param {Object} text
 * @param {Object} suffix
 */
Envjs.writeToTempFile = function(text, suffix){};

/**
 * Used to read the contents of a local file
 * @param {Object} url
 */
Envjs.readFromFile = function(url){};

/**
 * Used to delete a local file
 * @param {Object} url
 */
Envjs.deleteFile = function(url){};


Envjs.connections = [];
Envjs.connections.addConnection = Envjs.sync(function(xhr){
    log.debug('registering connection.');
    Envjs.connections.push(xhr);
});
Envjs.connections.removeConnection = Envjs.sync(function(xhr){
    log.debug('unregistering connection.');
    var i;
    for(i = 0; i < Envjs.connections.length; i++){
        if(Envjs.connections[i] === xhr){
            Envjs.connections.splice(i,1);
            break;
        }
    }
    return;
});
/**
 * establishes connection and calls responsehandler
 * @param {Object} xhr
 * @param {Object} responseHandler
 * @param {Object} data
 */
Envjs.connection = function(xhr, responseHandler, data){};

Envjs.localXHR = function(url, xhr, connection, data){
    try{
        if ( "PUT" == xhr.method || "POST" == xhr.method ) {
            log.debug('writing to file %s', url);
            data =  data || "" ;
            Envjs.writeToFile(data, url);
            xhr.readyState = 4;
            //could be improved, I just cant recall the correct http codes
            xhr.status = 200;
            xhr.statusText = "";
        } else if ( xhr.method == "DELETE" ) {  
            log.debug('deleting file %s', url);
            Envjs.deleteFile(url);
            xhr.readyState = 4;
            //could be improved, I just cant recall the correct http codes
            xhr.status = 200;
            xhr.statusText = "";
        } else {
            //try to add some canned headers that make sense
            log.debug('reading from file %s', url);
            xhr.readyState = 4;
            xhr.statusText = "ok";
            xhr.responseText = Envjs.readFromFile(url);
            try{
                if(url.match(/html$/)){
                    xhr.responseHeaders["Content-Type"] = 'text/html';
                }else if(url.match(/.xml$/)){
                    xhr.responseHeaders["Content-Type"] = 'text/xml';
                }else if(url.match(/.js$/)){
                    xhr.responseHeaders["Content-Type"] = 'text/javascript';
                }else if(url.match(/.json$/)){
                    xhr.responseHeaders["Content-Type"] = 'application/json';
                }else{
                    xhr.responseHeaders["Content-Type"] = 'text/plain';
                }
                //xhr.responseHeaders['Last-Modified'] = connection.getLastModified();
                //xhr.responseHeaders['Content-Length'] = headerValue+'';
                //xhr.responseHeaders['Date'] = new Date()+'';
            }catch(ee){
                log.error('failed to load response headers', ee);
            }
        }
    }catch(e){
        log.error('failed to open file %s %s', url, e);
        connection = null;
        xhr.readyState = 4;
        xhr.statusText = "Local File Protocol Error";
        xhr.responseText = "<html><head/><body><p>"+ e+ "</p></body></html>";
    }
};

__extend__(Envjs, urlparse);

}(/*Envjs.XMLHttpRequest.Core*/));