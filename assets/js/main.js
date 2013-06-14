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

//Local gameboard
var players = false;
var bullets = false;
var playerData = false;


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
  paint(new Graphics(document.getElementById(CANVAS_ID),document.getElementById(CANVAS_ID).getContext('2d')));
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
	});
	socket.emit('getGameBoard',{
	  sessionKey:sessionKey,
	});
  });

  //Start listening for players data
  socket.on('gameBoard',function(data){
	players=data.players;
	playerData=data.playerData;
  });
}

function run(){
}


function paint(graphics){
  //Debug graphics.
  
  if (playerData && players /* && bullets TODO: uncomment */){
	
	//Clear the screen before drawing things
	graphics.clearScreen('black');

	//Draw player
	graphics.circle(0,0,Math.PI/2,15,'white','blue');

	//Draw everybody else
	for (var i = 0; i < players.length; i++){
	  if (players[i].username!=playerData.username){
		graphics.circle(players[i].x-playerData.playerObj.x,players[i].y-playerData.playerObj.y,Math.PI/2,15,'white','red');
	  }
	  graphics.string(players[i].x-playerData.playerObj.x,players[i].y-playerData.playerObj.y,'white',players[i].username);
	}
	
	//Set callback for next frame
  }
  window.requestAnimFrame(function(){paint(graphics);});
}

//Debug graphics abstraction

function Graphics(cvs,ctx){
  this.cvs=cvs;
  this.ctx=ctx;
  this.circle=function(x,y,angle,radius,lineColor,fillColor){
	this.ctx.beginPath();
	this.ctx.arc(this.cvs.width/2+x,this.cvs.height/2-y,radius,0,2*Math.PI,false);
	this.ctx.strokeStyle=lineColor;
	this.ctx.fillStyle=fillColor
	this.ctx.lineWidth=1;
	this.ctx.stroke();
	this.ctx.fill();
  }
  this.rect=function(x,y,angle,width,height,lineColor,fillColor){
	this.ctx.save();
	this.ctx.translate(this.cvs.width/2+x,this.cvs.height/2-y);
	this.ctx.rotate(angle);
	this.ctx.fillStyle=fillColor;
	this.ctx.strokeStyle=lineColor;
	this.ctx.fillRect(-width/2,-height/2,width,height);
	this.ctx.strokeRect(-width/2,-height/2,width,height);
	this.ctx.restore();
  }
  this.string=function(x,y,lineColor,s){
	this.ctx.strokeStyle=lineColor;
	this.ctx.strokeText(s,this.cvs.width/2+x,this.cvs.height/2-y);
  }
  this.clearScreen=function(color){
	this.ctx.fillStyle=color;
	this.ctx.fillRect(0,0,cvs.width,cvs.height);
  }
}
