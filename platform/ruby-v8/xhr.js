(function(){
    
var log = Envjs.logger('Envjs.XMLHttpRequest.RubyRacer');

/**
 * Get 'Current Working Directory'
 */
Envjs.getcwd = function() {
    return Ruby.ENV.PWD;
};

/**
 * Used to read the contents of a local file
 * @param {Object} url
 */
Envjs.readFromFile = function( url ){
	if(/^file\:\/\//.test(url))
		url = url.substring(7,url.length);
    log.debug('reading file %s', url);
    var file = fopen(url, 'r'),
        data = file.read();
    return data;
};

Envjs.writeToFile = function(text, url){
    var file = fopen(url, 'w');
	log.debug('writing to file %s', url);
	file.write(text);
	return;
};

/**
 * Used to write to a local file
 * @param {Object} text
 * @param {Object} suffix
 */
Envjs.writeToTempFile = function(text, suffix){
    // Create temp file.
    var temp = Envjs.tmpdir+"."+(new Date().getTime())+(suffix||'.js');
    log.debug("writing text to temp url : %s ", temp);
    Envjs.writeToFile(text, temp);
    return temp;
};


/**
 * Used to read the contents of a local file
 * @param {Object} url
 */
Envjs.readFromFile = function( url ){
	if(/^file\:\/\//.test(url))
		url = url.substring(7,url.length);
	log.debug('reading file %s', url);
    var file = fopen(url, 'r'),
		data = file.read();
	return data;
};
    

/**
 * Used to delete a local file
 * @param {Object} url
 */
Envjs.deleteFile = function(url){
    return ;//TODO
};

/**
 * establishes connection and calls responsehandler
 * @param {Object} xhr
 * @param {Object} responseHandler
 * @param {Object} data
 */
Envjs.connection = function(xhr, responseHandler, data){
    var url = xhr.url,
		urlparts = Envjs.urlsplit(xhr.url),
        connection,
		request,
		headers,
        header,
        length,
        binary = false,
        name, value,
        contentEncoding,
        responseXML,
        i;
       
    if ( /^file\:/.test(url) ) {
	    log.debug('establishing file connection');
        Envjs.localXHR(url, xhr, connection, data);
    } else {
	    log.debug('establishing http native ruby connection %s', xhr.url);
		try{
			
	        connection = HTTPConnection.connect(
				urlparts.hostname,
				Number(urlparts.port||80)
			);
			log.debug('native ruby connection established %s', connection);

			path = urlparts.path+(urlparts.query?'?'+urlparts.query:'');
			request = HTTPConnection.request(xhr.method.toUpperCase(), path);
			log.debug('request query string %s', urlparts.query);
			log.debug('formulated %s request %s %s', xhr.method, urlparts.path, request);
			//TODO: add gzip support
	        //connection.putheader("Accept-Encoding", 'gzip');
			//connection.endheaders();
		
	        //write data to output stream if required
			//TODO: if they have set the request header for a chunked
			//request body, implement a chunked output stream
	        if(data){
	            if(data instanceof Document){
	                if ( xhr.method == "PUT" || xhr.method == "POST" ) {
	                    connection.send((new XMLSerializer()).serializeToString(data));
	                }
	            }else if(data.length&&data.length>0){
	                if ( xhr.method == "PUT" || xhr.method == "POST" ) {
	                    connection.send(data+'');
	                }
	            }
	        }
		}catch(e){
			log.error("connection failed %s",e);
			if (connection){
				HTTPConnection.finish(connection);
			}
			connection = null;
		}
    }

    if(connection){
		log.debug('loading response from native ruby connection');
		response = HTTPConnection.go(connection, request, xhr.headers, null);
		log.debug('got response from native ruby connection');
		headers = response[1];
		response = response[0];
        try{
            // Stick the response headers into responseHeaders
            for (var header in headers) {
				log.debug('response header [%s] = %s', header, headers[header]);
                xhr.responseHeaders[header] = headers[header];
            }
        }catch(e){
            log.error('failed to load response headers \n%s',e);
        }

        xhr.readyState = 4;
        xhr.status = parseInt(response.code,10) || undefined;
        xhr.statusText = response.message || "";
		log.info('%s %s %s %s', xhr.method, xhr.status, xhr.url, xhr.statusText);
        contentEncoding = xhr.getResponseHeader('content-encoding') || "utf-8";
        responseXML = null;
        
        try{
            //console.log('contentEncoding %s', contentEncoding);
            if( contentEncoding.toLowerCase() == "gzip" ||
                contentEncoding.toLowerCase() == "decompress"){
                //zipped content
                binary = true;
				//TODO
				log.debug('TODO: handle gzip compression');
                xhr.responseText = response.body;
            }else{
                //this is a text file
                xhr.responseText = response.body+'';
            }
        }catch(e){
            log.warn('failed to open connection stream \n%s, %s %s %s',
            	xhr.status, xhr.url, e.toString(), e
			);
        }finally{
			if(connection){
				HTTPConnection.finish(connection);
			}
		}


    }
    
    if(responseHandler){
        log.debug('calling ajax response handler');
        if(!xhr.async){
			log.debug('calling sync response handler directly');
			responseHandler();
		}else{
			log.debug('using setTimeout for async response handler');
			setTimeout(responseHandler, 1);
		}
    }
};

})(/*Envjs.XMLHttpRequest.Johnson*/);