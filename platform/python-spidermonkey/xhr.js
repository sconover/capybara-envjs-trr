
(function(){

var log = Envjs.logger('Envjs.XMLHttpRequest.SpyderMonkey');

/**
 * Get 'Current Working Directory'
 */
Envjs.getcwd = function() {
    return os.getcwd();
}


/**
 * Used to write to a local file
 * @param {Object} text
 * @param {Object} url
 */
Envjs.writeToFile = function(text, url){
    var file = fopen(url, 'w');
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
	if(/^file\:\/\//.test(url))
		url = url.substring(7,url.length);
	log.debug('deleting file %s', url);
    return os.delete(url);
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
        header,
        length,
        binary = false,
        name, value,
        contentEncoding,
        responseXML,
        i;
       
    if ( /^file\:/.test(url) ) {
	    log.debug('establishing platform file connection');
        Envjs.localXHR(url, xhr, connection, data);
    } else {
	    log.debug('establishing python platform network connection');
		try{
	        log.debug('connecting to %s \n\t port(%s) hostname(%s) path(%s) query(%s)', 
	            url, urlparts.port, urlparts.hostname, urlparts.path, urlparts.query);
        	connection = httplib.HTTPConnection(urlparts.hostname, urlparts.port || 80);
			connection.connect();
			request = connection.putrequest(
				xhr.method, 
				urlparts.path+(urlparts.query?'?'+urlparts.query:'')
			);

	        // Add headers to connection
	        for (header in xhr.headers){
	            log.debug('adding request header %s %s',header+'', xhr.headers[header]+'')
	            connection.putheader(header+'', xhr.headers[header]+'');
	        }
			//TODO: add gzip support
	        //connection.putheader("Accept-Encoding", 'gzip');
			connection.endheaders();
		
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
		    log.error('error making python native connection %s', e);
			connection.close();
			connection = null;
		}
    }

    if(connection){
        try{
		    response = connection.getresponse();
	        log.debug('got native platform connection response');
            length = response.getheaders().length;
            // Stick the response headers into responseHeaders
            for (i = 0; i < length; i++) {
				header = response.getheaders()[i];
                name = header[0];
                value = header[1];
                if (name){
	                log.debug('response header %s %s', name, value);
                    xhr.responseHeaders[name+''] = value+'';
                }
            }
        }catch(e){
            console.log('failed to load response headers \n%s',e);
        }

        xhr.readyState = 4;
        xhr.status = parseInt(response.status,10) || undefined;
        xhr.statusText = response.reason || "";
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
				console.log('TODO: handle gzip compression');
                xhr.responseText = response.read();
            }else{
                //this is a text file
                xhr.responseText = response.read();
            }
        }catch(e){
            if (xhr.status == 404){
                console.log('failed to open connection stream \n %s %s',
                            e.toString(), e);
            }else{
                console.log('failed to open connection stream \n %s %s',
                            e.toString(), e);
            }
        }finally{
			connection.close();
		}
    }
    
    if(responseHandler){
        log.debug('calling ajax response handler');
        if(!xhr.async){
			responseHandler();
		}else{
			setTimeout(responseHandler, 1);
		}
    }
};

})(/*Envjs.Platform.SpyderMonkey*/);