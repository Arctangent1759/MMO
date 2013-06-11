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

// begin William.update

function update(name)
{
  filterMap()
  filterPlayer(name)
}

function filterMap()
{
  
}

/*
- player array does not need to be ordered, but has to hold JSON objects with at least four properties:
  - id (playerId)
  - name (playerName)
  - x coordinate (xPosition)
  - y coordinate (yPosition)
*/

// sample array
var playerArray =
[
{id:0, playerName:"William", xPosition:69, yPosition:77},
{id:1, playerName:"Alex", xPosition:17, yPosition:59},
{id:2, playerName:"Nitin", xPosition:0, yPosition:100},
{id:3, playerName:"Kara", xPosition:50, yPosition:50},
{id:4, playerName:"Robert", xPosition:-10, yPosition:-10}
]


// *
// *
// * begin actual code *
// *
// *

/*
objectArray: array of all objects, some of which may be arrays
playerArray: array of player objects
playerClient: current player object
playerInLoop: other player objects in the playerArray
.playerId: integer id property of the player object
.xPosition: x coordinate property of any object
.yPosition: y coordinate property of any object
*/

function getPlayer(playerArray, playerId) // returns the player object
{
  for (index = 0; index < playerArray.length; index = index + 1)
  {
    if (playerArray[index].playerId == playerId) // not sure how to make property a specification as a function parameter
    {
      return playerArray[index]; // should the objectArray be an array of objects, or a multidimensional array
    }
  }
}


function filter(objectArray, playerId, filterFunction) // should consider creating a filter object to loop through the filter methods
{
  var index = objectArray.length;
  var player = getPlayer(objectArray, playerId); // getting player object, assuming playerArray is a subset of objectArray
  var filteredArray = objectArray.slice(0); // setting new array object so that the initial one won't be affected
  while (index > 0) // basic loop through objects of array
  {
    if (filterFunction(filteredArray[index], player) == false)
    {
      filteredArray.splice(index, 1); // remove the object from array if conditions do not satisfy
      index = index - 1; // increment
    }
  }
  return filteredArray;
}


function display(objectArray) // input the filtered object array, not the individual objects
{
  for (index = 0; index > objectArray.length; index = index + 1)
  {
    var canvas = document.getElementById("canvasId");
    var context = canvas.getContext("2d"); // create new context object
    function objectDraw() // create new function to attach to the canvas context object, with no parameters
    {
      objectArray[index].draw();
    }
    context.prototype.objectDraw(); // attaching the method to the object
    context.objectDraw(); // calling the method to actually draw
  }
}


function distance(integer1, integer2)
{
  return Math.sqrt((integer1 * integer) + (integer2 * integer2));
}


function filterSight(playerInLoop, playerClient) // canvas width and height can be exchanged to screen width and height upon full screen
{
  var canvas = document.getElementById("canvasId");
  var distanceX = playerInLoop.xPosition - playerClient.xPosition;
  var distanceY = Math.abs(playerInLoop.yPosition - playerClient.yPosition); // the screen origin starts at the upper left hand corner
  var slope = distanceY / distanceX; // cotangent of angle in degrees is the slope of y/x
  if (withinFog() || withinBlind())
  {
    return false;
  }
  if (
    distance(distanceX, distanceY) < (6/5 * canvas.height) && // circle definition, increased for aesthetics, later limited
    slope > viewAngle(playerClient) && // arc specification, should be a fraction such as 1/4
    slope < -viewAngle(playerClient) &&
    distanceX < ((canvas.width / 2) + 25) && // right asymptote, 25 pixels for buffer in case object edges are in range
    distanceX > (-(canvas.width) / 2) - 25) && // left asymptote
    distanceY < (canvas.height + 25) && // top asymptote
    distanceY > -25 // bottom asymptote
    )
  {
    return true;
  }
  else
  {
    return false;
  }
}


function withinFog(playerInLoop, playerClient)
{
  // to be done
}


function withinBlind(playerInLoop, playerClient)
{
  // to be done
}


function viewAngle(playerClient)
{
  if (playerClient.mouseRight == true) // player.weapon.zoom has to be in 1x, 2x, 4x, 8x, 16x
  {
    if (playerClient.weapon.zoom == 1)
    {
      return 0.25;
    }
    else
    {
      return (playerClient.weapon.zoom / 2);
    }
  }
}


function filterActive(playerInLoop)
{
  if (playerInLoop.active == true)
  {
    return true;
  }
}
// *
// *
// * end actual code *
// *
// *







// sum of areas check
// perimeter arrays cross analysis check
// max edge estimation check

function sumScreen(object1, object2)
{
// count number of pixels occupied on screen by object1 and object2
}

function intersection(object1, object2)
{
  if (object1.area + object2.area) > sumScreen(object1, object2)
  {
    return true;
  }
  else
  {
    return false;
  }
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
