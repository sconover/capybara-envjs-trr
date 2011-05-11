
(function(){
    
Envjs.Configuration = {
    /** Please see each module for specific configuration options */
    //this is a short list of well knowns, but can always be extended
    logging:[
        {category:'Envjs.Core',                 level:'WARN'},
        {category:'Envjs.Core.REPL',            level:'WARN'},
        {category:'Envjs.DOM',                  level:'WARN'},
        {category:'Envjs.DOM.Node',             level:'WARN'},
        {category:'Envjs.DOM.NodeList',         level:'WARN'},
        {category:'Envjs.DOM.NamedNodeMap',     level:'WARN'},
        {category:'Envjs.DOM.Element',          level:'WARN'},
        {category:'Envjs.DOM.Document',         level:'WARN'},
        {category:'Envjs.DOM.EventTarget',      level:'WARN'},
        {category:'Envjs.Timer',                level:'WARN'},
        {category:'Envjs.Location',             level:'WARN'},
        {category:'Envjs.XMLHttpRequest',       level:'WARN'},
        {category:'Envjs.Parser',               level:'WARN'},
        {category:'Envjs.Parser.HTMLParser',    level:'WARN'},
        {category:'Envjs.Parser.XMLParser',     level:'WARN'},
        {category:'Envjs.HTML.FrameElement',    level:'WARN'},
        {category:'Envjs.Window',               level:'WARN'},
        {category:'Envjs.Platform',             level:'WARN'},
        {category:'root',                       level:'WARN'}
    ], 
    env : {
        dev:{},
        prod:{},
        test:{}
    }
};

Envjs.config = function(){
    var config, subconfig;
    if(arguments.length === 0){
        return Envjs.Configuration;
    }else if(arguments.length === 1 && typeof(arguments[0]) == "string"){
        return Envjs.Configuration[arguments[0]];
    }else{
        Envjs.Configuration[arguments[0]] =  arguments[1];
    }
    return this;//chain
};

    
var $guid = 0;  
Envjs.guid = function(){
    return ++$guid;
};

}(/*Envjs.Configuration*/));
