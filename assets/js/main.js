//Constants
var CONTAINER_ID="game";
var CANVAS_ID="canvas";
var PADDING=50;

//sessionKey
var sessionKey=processQueryString().sessionKey;

$(document).ready(function(){
  init();
  setInterval(run,16);
  paint();
});


window.requestAnimFrame = (function(){
  return (
	window.requestAnimationFrame       || 
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame    || 
	window.oRequestAnimationFrame      || 
	window.msRequestAnimationFrame     || 
	function(/* function */ callback){
	  window.setTimeout(callback, 1000 / 60);
	}
  );
})();


function init(){
  //Create game canvas
  $("#"+CONTAINER_ID).html("<div width='100%'height='"+PADDING+"'>&nbsp</div><canvas id="+CANVAS_ID+" class=game_container width=200 height=200></canvas>");
  var cvs=document.getElementById(CANVAS_ID);

  //Style canvas
  window.onresize=function(){cvs.height=window.innerHeight-PADDING;cvs.width=window.innerWidth-PADDING;};
  window.onresize();

  //Load resources
}

function run(){
}

function paint(){
   window.requestAnimFrame(paint);
}


var socket=io.connect('http://'+window.location.host);

socket.emit('setup',{sessionKey:sessionKey});

function sendChat(message,channel){
  var msg={
	sessionKey:sessionKey,
	channel:channel,
	message:message,
  };
  socket.emit('chat',msg);
}

function recieveChat(data){
  //TODO: Actually do stuff with UI.
  console.log('@'+data.timestamp+'  ---  '+data.sender+' >> '+data.channel+': ' + data.message);
}

socket.on('chat',recieveChat);
