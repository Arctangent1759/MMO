///////////////////////////////////////////////////////////
//       ***       Variable Declarations       ***       //
///////////////////////////////////////////////////////////

//Constants
var CONTAINER_ID="game";
var CANVAS_ID="canvas";
var PADDING=50;

//sessionKey
var sessionKey=processQueryString().sessionKey;

//Global vars
var socket=io.connect('http://'+window.location.host);



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



//////////////////////////////////////////////////////
//        ***        Program Body        ***        //
//////////////////////////////////////////////////////

$(document).ready(function(){
  init();
  setInterval(run,16);
  paint();
});

function init(){

  //Alert the server of your connection.
  socket.emit('setup',{sessionKey:sessionKey});

  //Set up chat socket
  setupChat();

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