//Constants
var FRICTION=.5;

var server=require('./server.js');
var router=require('./router.js').route;
var handle=require('./handle.js').handle;
var gameLoop=require('./game.js').gameLoop;

server.start(router,handle);
gameLoop();
