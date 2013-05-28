var http = require('http');
var url = require('url');

function start(route,handle){
  console.log("Server starting...");

  http.createServer(function(request,response){
	var pathname = url.parse(request.url).pathname;
	route(handle,pathname,response);
  }).listen(1759);
  console.log("Server started. Press Ctrl-c to stop.");
}
exports.start=start;
