var filesystem = require('fs');
/**
 * Get 'Current Working Directory'
 */
Envjs.getcwd = function() {
    return process.cwd();
}


/**
 * Used to write to a local file
 * @param {Object} text
 * @param {Object} url
 */
Envjs.writeToFile = function(text, url){
	if(/^file\:\/\//.test(url))
		url = url.substring(7,url.length);
    filesystem.writeFileSync(url, text, 'utf8');
};

/**
 * Used to write to a local file
 * @param {Object} text
 * @param {Object} suffix
 */
Envjs.writeToTempFile = function(text, suffix){
	var url =  Envjs.tmpdir+'envjs-'+(new Date().getTime())+'.'+suffix;
	if(/^file\:\/\//.test(url))
		url = url.substring(7,url.length);
	filesystem.writeFileSync(tmpfile, text, 'utf8');
    return tmpfile;
};


/**
 * Used to read the contents of a local file
 * @param {Object} url
 */
Envjs.readFromFile = function( url ){
	if(/^file\:\/\//.test(url))
		url = url.substring(7,url.length);
    return filesystem.readFileSync(url, 'utf8');
};
    

/**
 * Used to delete a local file
 * @param {Object} url
 */
Envjs.deleteFile = function(url){
	if(/^file\:\/\//.test(url))
		url = url.substring(7,url.length);
    filesystem.unlink(url);
};

/**
 * establishes connection and calls responsehandler
 * @param {Object} xhr
 * @param {Object} responseHandler
 * @param {Object} data
 */
Envjs.connection = function(xhr, responseHandler, data){
    var url = xhr.url,
        connection,
		request,
        binary = false,
        contentEncoding,
        responseXML = null,
		http = require('http'),
		urlparts = Envjs.urlsplit(url),
        i;

        
    if ( /^file\:/.test(url) ) {
        Envjs.localXHR(url, xhr, connection, data);
    } else {
	    //console.log('connecting to %s \n\t port(%s) host(%s) path(%s) query(%s)', 
	    //    url, urlparts.port, urlparts.hostname, urlparts.path, urlparts.query);
		connection = http.createClient(urlparts.port||'80', urlparts.hostname);
		request = connection.request(
			xhr.method, 
			urlparts.path+(urlparts.query?"?"+urlparts.query:''),
			__extend__(xhr.headers,{
				"Host": urlparts.hostname,
				//"Connection":"Keep-Alive"
				//"Accept-Encoding", 'gzip'
			})
		);
		xhr.statusText = "";

	    if(connection&&request){
			request.on('response', function (response) {
				//console.log('response begin');
				xhr.readyState = 3;
				response.on('end', function (chunk) {
					//console.log('connection complete');
		        	xhr.readyState = 4;
				    if(responseHandler){
				        //console.log('calling ajax response handler');
				        if(!xhr.async){
							responseHandler();
						}else{
							setTimeout(responseHandler, 1);
						}
				    }
					if(xhr.onreadystatechange){
						xhr.onreadystatechange();
					}
				});

				xhr.responseHeaders = __extend__({},response.headers);
                xhr.statusText = "OK";
			    xhr.status = response.statusCode;
				//console.log('response headers : %s', JSON.stringify(xhr.responseHeaders));
				contentEncoding = xhr.getResponseHeader('Content-Encoding') || "utf-8";
				response.setEncoding(contentEncoding);
	            //console.log('contentEncoding %s', contentEncoding);

			  	response.on('data', function (chunk) {
			    	//console.log('\nBODY: %s', chunk);
		            if( contentEncoding.match("gzip") ||
		                contentEncoding.match("decompress")){
		                //zipped content
		                binary = true;
						//Not supported yet
		                xhr.responseText += (chunk+'');
		            }else{
		                //this is a text file
		                xhr.responseText += (chunk+'');
		            }
					if(xhr.onreadystatechange){
						xhr.onreadystatechange();
					}
			  	});
				if(xhr.onreadystatechange){
					xhr.onreadystatechange();
				}
			});
	    }
        //write data to output stream if required
		//TODO: if they have set the request header for a chunked
		//request body, implement a chunked output stream
		
        //console.log('sending request %s\n', xhr.url);
        if(data){
            if(data instanceof Document){
                if ( xhr.method == "PUT" || xhr.method == "POST" ) {
                    xml = (new XMLSerializer()).serializeToString(data);
					request.write(xml);
                }
            }else if(data.length&&data.length>0){
                if ( xhr.method == "PUT" || xhr.method == "POST" ) {
                    request.write(data);
                }
            }
            request.end();
        }else{
            request.end();
        }
    }

};
