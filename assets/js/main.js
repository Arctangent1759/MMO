///////////////////////////////////////////////////////////
//       ***       Variable Declarations       ***       //
///////////////////////////////////////////////////////////

//Constants
var CONTAINER_ID="game";
var CANVAS_ID="canvas";
var PADDING=50;
var RADAR_RADIUS=100;
var RADAR_SPEED=.05;
var RADAR_REACH=10000;

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
  upgrade:"",
};
var lastUpgrade="";
var radarAngle=0;
var radarMarkerState=1;

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
  paint(new Graphics(document.getElementById(CANVAS_ID),document.getElementById(CANVAS_ID).getContext('2d')));
});

function init(){

  //Alert the server of your connection.
  socket.emit('setup',{sessionKey:sessionKey});

  //Set up chat socket
  setupChat(function(data){
	document.getElementById("chatOutput").innerHTML+="<span class='chatItem'>&nbsp;&nbsp;<span style='color:#00FF33;'>"+data.sender+'</span>: ' + data.message+"</span><br/>"
	document.getElementById("chatOutput").scrollTop = document.getElementById("chatOutput").scrollHeight;
  });
  var chatInput = document.getElementById("chatTextBox");
  chatInput.onkeyup=function(e){
	if (e.keyCode==13){
	  sendChat(chatInput.value,"ALL");
	  chatInput.value="";
	}
  }
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
	if (document.activeElement.id!="chatTextBox"){
	  command.keyboard[String.fromCharCode(e.which).toLowerCase()]=true;
	}
  });
  $(document).keyup(function(e){
	command.keyboard[String.fromCharCode(e.which).toLowerCase()]=false;
  });

  //Start server control reporting process
  socket.on('game_heartbeat',function(data){
	if (lastUpgrade==command.upgrade){
	  command.upgrade="";
	}
	lastUpgrade=command.upgrade;
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



function paint(graphics){
  var radar_pts=[];

  command.upgrade="";

  //Debug graphics.

  if (playerData && players){

	//Clear the screen before drawing things
	graphics.clearScreen('black');

	//Draw player
	graphics.circle(0,0,Math.PI/2,15,'white','blue');

	//Draw everybody else
	var me;
	for (var i = 0; i < players.length; i++){
	  if (players[i].username!=playerData.username){
		graphics.circle(players[i].x-playerData.playerObj.x,players[i].y-playerData.playerObj.y,Math.PI/2,15,'white','red');
		//Draw health bar
		graphics.rect(players[i].x-playerData.playerObj.x,players[i].y-playerData.playerObj.y+25,0,30*players[i].health/players[i].max_health,5,'white','red');
		if (getDistance(playerData.playerObj.x,playerData.playerObj.y,players[i].x,players[i].y)<RADAR_REACH){
		  radar_pts.push([
			  RADAR_RADIUS*(players[i].x-playerData.playerObj.x)/RADAR_REACH,
			  RADAR_RADIUS*(players[i].y-playerData.playerObj.y)/RADAR_REACH
			  ]);
		}
	  }else{
		me=players[i];
	  }
	  graphics.string(players[i].x-playerData.playerObj.x,players[i].y-playerData.playerObj.y,'white',players[i].username);
	  for (var j = 0; j < players[i].bullets.length; j++){
		graphics.circle(players[i].bullets[j]._position._x-playerData.playerObj.x,players[i].bullets[j]._position._y-playerData.playerObj.y,Math.PI/2,5,'white','yellow');
	  }
	}

	//Draw HUD
	//Health bar
	graphics.rect(0,-(window.innerHeight-PADDING)/2+20,0,200,5,'white','black');
	graphics.rect(0,-(window.innerHeight-PADDING)/2+20,0,200*me.health/me.max_health,5,'white','red');
	//EXP Bar
	graphics.sideRect((window.innerWidth-PADDING)/2-220,(window.innerHeight-PADDING)/2-20,0,200,5,'white','black');
	graphics.sideRect((window.innerWidth-PADDING)/2-220,(window.innerHeight-PADDING)/2-20,0,200*me.exp/me.max_exp,5,'white','yellow');
	graphics.string((window.innerWidth-PADDING)/2-220,(window.innerHeight-PADDING)/2-40,'white',"Level " + me.level);
	//Stats
	graphics.string((window.innerWidth-PADDING)/2-220,(window.innerHeight-PADDING)/2-60,'white',"STR " + me.stats.strength);
	graphics.string((window.innerWidth-PADDING)/2-220,(window.innerHeight-PADDING)/2-80,'white',"DEX " + me.stats.dexterity);
	graphics.string((window.innerWidth-PADDING)/2-220,(window.innerHeight-PADDING)/2-100,'white',"CON " + me.stats.constitution);
	graphics.string((window.innerWidth-PADDING)/2-150,(window.innerHeight-PADDING)/2-60,'white',"INT " + me.stats.intelligence);
	graphics.string((window.innerWidth-PADDING)/2-150,(window.innerHeight-PADDING)/2-80,'white',"WIS " + me.stats.wisdom);
	graphics.string((window.innerWidth-PADDING)/2-150,(window.innerHeight-PADDING)/2-100,'white',"CHA " + me.stats.charisma);
	//SkillPoints Counter (Shown only if points avalible)
	if (me.stats.skillPoints>0){
	  graphics.string((window.innerWidth-PADDING)/2-220,(window.innerHeight-PADDING)/2-120,'white',"Skill Points: " + me.stats.skillPoints);
	  //Level Up Buttons
	  graphics.button((window.innerWidth-PADDING)/2-180,(window.innerHeight-PADDING)/2-60,20,10,"<+>","white","black",false,"green", upgradeStat,"STR");
	  graphics.button((window.innerWidth-PADDING)/2-180,(window.innerHeight-PADDING)/2-80,20,10,"<+>","white","black",false,"green", upgradeStat,"DEX");
	  graphics.button((window.innerWidth-PADDING)/2-180,(window.innerHeight-PADDING)/2-100,20,10,"<+>","white","black",false,"green", upgradeStat,"CON");
	  graphics.button((window.innerWidth-PADDING)/2-110,(window.innerHeight-PADDING)/2-60,20,10,"<+>","white","black",false,"green", upgradeStat,"INT");
	  graphics.button((window.innerWidth-PADDING)/2-110,(window.innerHeight-PADDING)/2-80,20,10,"<+>","white","black",false,"green", upgradeStat,"WIS");
	  graphics.button((window.innerWidth-PADDING)/2-110,(window.innerHeight-PADDING)/2-100,20,10,"<+>","white","black",false,"green", upgradeStat,"CHA");
	}
	//Radar
	//Sweep
	graphics.arcCircle((window.innerWidth-PADDING)/2-120,0,radarAngle,Math.PI/3,RADAR_RADIUS,false,"#006440");
	radarAngle+=RADAR_SPEED;
	//Lines
	graphics.line((window.innerWidth-PADDING)/2-120-RADAR_RADIUS,0,(window.innerWidth-PADDING)/2-120+RADAR_RADIUS,0,'#777777');
	graphics.line((window.innerWidth-PADDING)/2-120,-RADAR_RADIUS,(window.innerWidth-PADDING)/2-120,RADAR_RADIUS,'#777777');
	graphics.circle((window.innerWidth-PADDING)/2-120,0,0,RADAR_RADIUS,'#555555',false);
	graphics.circle((window.innerWidth-PADDING)/2-120,0,0,3*RADAR_RADIUS/4,'#777777',false);
	graphics.circle((window.innerWidth-PADDING)/2-120,0,0,RADAR_RADIUS/2,'#AAAAAA',false);
	graphics.circle((window.innerWidth-PADDING)/2-120,0,0,RADAR_RADIUS/4,'#FFFFFF',false);
	for (var i = 0; i < radar_pts.length; i++){
	  graphics.circle((window.innerWidth-PADDING)/2-120+radar_pts[i][0],radar_pts[i][1],0,radarMarkerState/10,'red',false);
	}
	radarMarkerState=(radarMarkerState+1)%25
  }
  //Set callback for next frame
  window.requestAnimFrame(function(){paint(graphics);});
}

function upgradeStat(stat){
  command.upgrade=stat;
}
function getDistance(x1,y1,x2,y2){
  return Math.sqrt((y2-y1)*(y2-y1)+(x2-x1)*(x2-x1));
}

//Debug graphics abstraction

function Graphics(cvs,ctx){
  this.cvs=cvs;
  this.ctx=ctx;
  this.line=function(x1,y1,x2,y2,lineColor){
	this.ctx.beginPath();
	this.ctx.moveTo(this.cvs.width/2+x1, this.cvs.height/2-y1);
	this.ctx.lineTo(this.cvs.width/2+x2, this.cvs.height/2-y2);
	this.ctx.strokeStyle=lineColor;
	this.ctx.stroke();
  }
  this.circle=function(x,y,angle,radius,lineColor,fillColor){
	this.arcCircle(x,y,angle,2*Math.PI,radius,lineColor,fillColor);
  }
  this.arcCircle=function(x,y,angle,angleSweep,radius,lineColor,fillColor){
 	this.ctx.beginPath();
	if (angleSweep!=2*Math.PI){
	this.ctx.moveTo(this.cvs.width/2+x, this.cvs.height/2-y);
	}
	this.ctx.arc(this.cvs.width/2+x,this.cvs.height/2-y,radius,angle,angle+angleSweep,false);
	if (angleSweep!=2*Math.PI){
	  this.ctx.lineTo(this.cvs.width/2+x, this.cvs.height/2-y);
	}
	this.ctx.lineWidth=1;
	if (lineColor){
	  this.ctx.strokeStyle=lineColor;
	  this.ctx.stroke();
	}
	if (fillColor){
	  this.ctx.fillStyle=fillColor;
	  this.ctx.fill();
	}
  }
  this.rect=function(x,y,angle,width,height,lineColor,fillColor){
	this.ctx.save();
	this.ctx.translate(this.cvs.width/2+x,this.cvs.height/2-y);
	this.ctx.rotate(angle);
	this.ctx.fillStyle=fillColor;
	this.ctx.strokeStyle=lineColor;
	if (fillColor){
	  this.ctx.fillRect(-width/2,-height/2,width,height);
	}
	if (lineColor){
	  this.ctx.strokeRect(-width/2,-height/2,width,height);
	}
	this.ctx.restore();
  }
  this.sideRect=function(x,y,angle,width,height,lineColor,fillColor){
	this.rect(x+width/2,y-height/2,angle,width,height,lineColor,fillColor);
  }
  this.string=function(x,y,lineColor,s){
	this.ctx.strokeStyle=lineColor;
	this.ctx.strokeText(s,this.cvs.width/2+x,this.cvs.height/2-y);
  }
  this.clearScreen=function(color){
	this.ctx.fillStyle=color;
	this.ctx.fillRect(0,0,cvs.width,cvs.height);
  }
  this.lastMouseState=false;
  this.button=function(x,y,width,height,text,textColor,lineColor,fillColor,mouseOverFill, callback, params){
	if (command.mouse.position[0]>x && command.mouse.position[0]<x+width && command.mouse.position[1]>y && command.mouse.position[1]<y+height){
	  if (mouseOverFill){
		this.sideRect(x,y,0,width,-height,lineColor,mouseOverFill);
	  }
	  if (this.lastMouseState && !command.mouse.click){
		//Button Click
		callback(params);
	  }
	  this.lastMouseState=command.mouse.click;
	}else{
	  if (fillColor){
		this.sideRect(x,y,0,width,-height,lineColor,fillColor);
	  }
	}
	this.string(x,y,textColor,text);
  }
}
