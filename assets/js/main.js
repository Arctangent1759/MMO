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
var isChatting=false;
var command={
  keyboard:{
  },
  mouse:{
	click:false,
	position:[0,0],
  },
};


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

  //Create and style game canvas
  $("#"+CONTAINER_ID).html("<div width='100%'height='"+PADDING+"'>&nbsp</div><canvas id="+CANVAS_ID+" class=game_container width=200 height=200></canvas>");
  var cvs=document.getElementById(CANVAS_ID);
  window.onresize=function(){cvs.height=window.innerHeight-PADDING;cvs.width=window.innerWidth-PADDING;};
  window.onresize();

  //Load resources
  
  //Set control eventhandlers
  $("#"+CANVAS_ID).mousemove(function(e){
	command.mouse.position[0] = e.clientX-this.offsetLeft-Math.floor($("#"+CANVAS_ID).width()/2);
	command.mouse.position[1] = -(e.clientY - this.offsetTop-Math.floor($("#"+CANVAS_ID).height()/2));
  });
  $("#"+CANVAS_ID).mouseup(function(e){
	command.mouse.click=false;
  });
  $("#"+CANVAS_ID).mousedown(function(e){
	command.mouse.click=true;
  });
  $(document).keydown(function(e){
	if (!isChatting){
	  command.keyboard[String.fromCharCode(e.which).toLowerCase()]=true;
	}
  });
  $(document).keyup(function(e){
	if (!isChatting){
	  command.keyboard[String.fromCharCode(e.which).toLowerCase()]=false;
	}
  });

  //Start server control reporting process
  socket.on('game_heartbeat',function(data){
	socket.emit('command',{
	  sessionKey:sessionKey,
	  command:command,
	})
  });

}

function run(){
}

function paint(){
   window.requestAnimFrame(paint);
}
