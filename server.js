var http = require('http');
var url = require('url');
var io = require('socket.io');

function start(route,handle){
  console.log("Server starting...");

  var server = http.createServer(function(request,response){
	var pathname = url.parse(request.url).pathname;
	route(handle,pathname,response);
  }).listen(1759,function(){
	console.log("Server started.");
	console.log("Listening at http://localhost:1759");
	console.log("Press Ctrl-c to stop.");
  });
  io.listen(server).on('connection',function(socket){
  });
}
exports.start=start;
