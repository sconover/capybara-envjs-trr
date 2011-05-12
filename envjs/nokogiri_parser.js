Envjs.parseHtmlDocument = (function(){
  function text() {
    
  }
  
  function comment() {
    
  }
  
  function element() {
    
  }
  
  function document() {
    
  }
  
  return function(source, document_0, useSetTimeouts, readyCallback, errorHandler){
    Ruby.puts("XXXXXXX parse XXXXXXXX")
    Ruby.p(Ruby.Nokogiri.HTML(source)["html?"])
    // Ruby.p(document_0)
  } 
})()


