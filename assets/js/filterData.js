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
  return Math.sqrt((integer1 * integer1) + (integer2 * integer2));
}


function filterSight(objectInLoop, mapObject, playerClient) // canvas width and height can be exchanged to screen width and height upon full screen
{
  var canvas = document.getElementById("canvasId");
  var distanceX = objectInLoop.xPosition - playerClient.xPosition;
  var distanceY = -(objectInLoop.yPosition - playerClient.yPosition); // the screen origin starts at the upper left hand corner
  // var slope = distanceY / distanceX; // taken out for the time being because of dividing by 0 error
  var angle = Math.atan2(distanceY, distanceX); // tangent(theta) = y / x, so angle theta == arctangent(slope)
  if (withinFog() || withinBlind(objectInLoop, mapObject, playerClient))
  {
    return false;
  }
  if (distance(distanceX, distanceY) < ((6.0/5.0) * (canvas.height)) //circle definition, increased for aesthetics, later limited
    && (angle > viewAngle(playerClient)) // arc specification, should be a radian measure
    && (angle < (Math.PI - viewAngle(playerClient)))
    && (distanceX < ((canvas.width / 2) + 25))// right asymptote, 25 pixels for buffer in case object edges are in range
    && (distanceX > (-(canvas.width) / 2) - 25)// left asymptote
    && (distanceY < (canvas.height + 25)) // top asymptote
    && (distanceY > -25) // bottom asymptote
    )
  {
    return true;
  }
  else
  {
    return false;
  }
}


function withinFog(objectInLoop, playerClient)
{
  // to be done
}


function withinBlind(objectInLoop, mapObject, playerClient) // where objectInLoop is any player or projectile object (but not mapObject)
{
  var filteredResult = filterCorners(mapObject, playerClient);
  var maxRight = filteredResult.maxRight;
  var maxLeft = filteredResult.maxLeft;
  var distanceXRight = maxRight.xPosition - playerClient.xPosition;
  var distanceYRight = maxRight.yPosition - playerClient.yPosition;
  var angleMaxRight = Math.atan2(distanceYRight, distanceXRight);
  var distanceXLeft = maxLeft.xPosition - playerClient.xPosition;
  var distanceYLeft = maxLeft.yPosition - playerClient.yPosition;
  var angleMaxLeft = Math.atan2(distanceYRight, distanceXRight);
  var objectPlayerAngle = Math.atan2((objectInLoop.yPosition - playerClient.yPosition), (objectInLoop.xPosition - playerClient.xPosition));
  if (objectPlayerAngle > angleMaxLeft && objectPlayerAngle < angleMaxRight && isOutside(maxLeft, maxRight, objectInLoop))
  {
    return false;
  }
  else
  {
    return true;
  }
}


function convertAngleTo(angle, angleType)
{
  if (angleType == "degrees")
  {
    return angle * 180 / Math.PI;
  }
  if (angleType == "radians")
  {
    return angle * Math.PI / 180;
  }
}


function logBaseTwo(integer) // thought needed to use, actually didn't, oops
{
  var number = integer;
  index = 0;
  while (number > 1)
  {
    number = number / 2;
    index = index + 1;
  }
  return index;
}


function viewAngle(playerClient) // data structure (naming, particularly playerClient.mouseRight and playerClient.weapon.zoom) needs fixing
{
  if (playerClient.mouseRight == true) // player.weapon.zoom has to be in 1x, 2x, 4x, 8x, 16x
  {
    if (playerClient.weapon.zoom == 1)
    {
      return convertAngleTo(15, "radians");
    }
    else
    {
      return (Math.PI / 2) - (2 * Math.atan(1 / playerClient.weapon.zoom)); // to test, do (pi/2 - 2*arctan(1/2)) * 180/pi on wolfram to get degree representation
    }
  }
}



function filterActive(objectInLoop)
{
  if (objectInLoop.active == true)
  {
    return true;
  }
}


function filterCorners(mapObject, playerClient) // mapObject.corners[] should be adjusted to be actual x/y coordinates of the corners of the mapObject, relative to the map origin and not mapObject.originX/Y, use find and replace in separate txt file for name changes
{
  var distanceXAlpha = mapObject.corners[0].xPosition - playerClient.xPosition;
  var distanceYAlpha = mapObject.corners[0].yPosition - playerClient.yPosition;
  var distanceXBeta = mapObject.corners[1].xPosition - playerClient.xPosition;
  var distanceYBeta = mapObject.corners[1].yPosition - playerClient.yPosition;
  var angleAlpha = Math.atan2(distanceYAlpha, distanceXAlpha);
  var angleBeta = Math.atan2(distanceYBeta, distanceXBeta);
  var filteredResult;
  if (angleAlpha < angleBeta)
  {
    filteredResult = {"maxRight": mapObject.corners[0], "maxLeft": mapObject.corners[1]};
  }
  else
  {
    filteredResult = {"maxRight": mapObject.corners[1], "maxLeft": mapObject.corners[0]};
  }
  for (index = 2; index < mapObject.corners.length; index = index + 1) // tricky thing with Math.atan2() is that it returns 0 to PI in the top hemisphere, and -PI to 0 in the bottom hemisphere; good thing other filters already take out any objects in the lower quadrants
  {
    var distanceXGamma = mapObject.corners[index].xPosition - playerClient.xPosition;
    var distanceYGamma = mapObject.corners[index].yPosition - playerClient.yPosition;
    var angleGamma = Math.atan2(distanceYGamma, distanceXGamma);
    if (angleGamma < Math.atan2(filteredResult.maxRight.yPosition - playerClient.yPosition, filteredResult.maxRight.xPosition - playerClient.xPosition))
    {
      filteredResult.maxRight = mapObject.corners[index];
    }
    if (angleGamma > Math.atan2(filteredResult.maxLeft.yPosition - playerClient.yPosition, filteredResult.maxLeft.xPosition - playerClient.xPosition))
    {
      filteredResult.maxLeft = mapObject.corners[index];
    }
  }
  return filteredResult; // return an object with properties maxRight and maxLeft
}


function slope(pointA, pointB)
{
  return (pointB.yPosition - pointA.yPosition) / (pointB.xPosition - pointA.xPosition); // how to fix denominator problem; update: fixed, use angle instead of slope
}


function isLeft(pointA, pointB, pointC) // source http://stackoverflow.com/questions/3461453/determine-which-side-of-a-line-a-point-lies
{
  return ((pointB.xPosition - pointA.xPosition) * (pointC.yPosition - pointA.yPosition) - (pointB.yPosition - pointA.yPosition) * (pointC.xPosition - pointA.xPosition)) > 0;
}


function isOutside(pointA, pointB, objectInLoop)
{
  var bool = isLeft(pointA, pointB, objectInLoop)
  var objectPlayerAngle = Math.atan2((objectInLoop.yPosition - playerClient.yPosition), (objectInLoop.xPosition - playerClient.xPosition));
  if (objectPlayerAngle > (Math.PI / 2))
  {
    if (bool == true)
    {
      return true;
    }
  }
  if ((objectPlayerAngle < (Math.PI / 2)) && (objectPlayerAngle > 0))
  {
    if (bool == true)
    {
      return true;
    }
  }
  else
  {
    return false;
  }
}


// *
// *
// * end actual code *
// *
// *



// IGNORE BELOW, ITS JUST THEORYCRAFTING
// sum of areas check
// perimeter arrays cross analysis check
// max edge estimation check

function sumScreen(object1, object2)
{
// count number of pixels occupied on screen by object1 and object2
}

function intersection(object1, object2)
{
  if ((object1.area + object2.area) > sumScreen(object1, object2))
  {
    return true;
  }
  else
  {
    return false;
  }
}