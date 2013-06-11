var constants=require('./server_constants.js').constants;

var server=require('./server.js');
var router=require('./router.js').route;
var handle=require('./handle.js').handle;

server.start(router,handle);
