/*

Update Functions

Input Naming Conventions

objectArray: abstract term for any array of objects, ex. networkObject.playerArray[]
networkPlayerObject: current player object in frame, the input that the server sends to client, ex. networkObject.playerArray[0]
variablePlayerObject: current player data in frame that changes but does not need to be sent over network, ex. variableObject.playerArray[0]
objectInLoop: other objects in the objectArray, usually from the network array

For more information, read dataStructure.js

*/





/////////////////////////////
//                         //
//  main update functions  //
//                         //
/////////////////////////////


function update(gameData, playerName)
{
    var filteredArray;
    filteredArray = filter(gameData, gameData.networkObject.playerArray, playerName, filterSight);
        for (index1 = gameData.networkObject.playerArray.length; index1 > 0; index1 = index1 - 1) // checking each player object
        {
            for (index2 = gameData.networkObject.playerArray[index1 - 1].projectileArray.length; index2 > 0; index2 = index2 - 1) // checking each projectile object of each player object
            {
                filteredArray = filter(gameData, gameData.networkObject.playerArray[index1 - 1].projectileArray[index2 - 1], playerName, filterSight); // consider the weapon to be part of the player, so if the player doesn't show up, neither does the weapon
            }
        }
    filteredArray = filter(gameData, gameData.networkObject.playerArray, playerName, filterActive);
    return filteredArray;
}





///////////////////////////////////////
//                                   //
//  update-related helper functions  //
//                                   //
///////////////////////////////////////


function filter(gameData, objectArray, playerName, filterFunction) // should consider creating a filter object to loop through the filter methods
{
    var index = objectArray.length;
//  var playerObject = getObject(objectArray, "objectName", objectName); // getting player object, using objectArray, where objectArray is commonly networkObject.playerArray
    var filteredArray = objectArray.slice(0); // setting new array object so that the initial one won't be affected
    for (index = objectArray.length; index > 0; index = index - 1) // basic loop through objects of array
    {
        if (filterFunction(gameData, filteredArray[index - 1], playerName) == false)
        {
            filteredArray.splice(index, 1); // remove the object from array if conditions do not satisfy
        }
    }
    return filteredArray;
}


function display(objectArray) // input the filtered object array after calling the function filter(), not the individual objects
{
    for (index = 0; index > objectArray.length; index = index + 1) // apparently, creating new functions using a for loop doesn't work
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





///////////////////////////////////////
//                                   //
//  object-related helper functions  //
//                                   //
///////////////////////////////////////


function getObject(objectArray, propertyName, objectProperty) // returns the player object; need to fix if can not find object
{
    for (index = 0; index < objectArray.length; index = index + 1)
    {
        if (objectArray[index][propertyName] == objectProperty) // not sure how to make property a specification as a function parameter
        {
            return objectArray[index]; // should the objectArray be an array of objects, or a multidimensional array
        }
    }
}


function switchPosition(objectArray, position1, position2) // use this for switching weapons, where objectArray[0] represents the current weapon in use
{
    var placeholder = objectArray[position1];
    objectArray[position1] = objectArray[position2];
    objectArray[position2] = placeholder;
}





/////////////////////////////////////
//                                 //
//  math-related helper functions  //
//                                 //
/////////////////////////////////////


function distance(integer1, integer2)
{
    return Math.sqrt((integer1 * integer1) + (integer2 * integer2));
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


function slope(pointA, pointB)
{
    return (pointB.yPosition - pointA.yPosition) / (pointB.xPosition - pointA.xPosition); // how to fix denominator problem; update: fixed, use angle instead of slope
}





///////////////////////////////////////
//                                   //
//  filter-related helper functions  //
//                                   //
///////////////////////////////////////


function isLeft(pointA, pointB, pointC) // source http://stackoverflow.com/questions/3461453/determine-which-side-of-a-line-a-point-lies
{
    return ((pointB.xPosition - pointA.xPosition) * (pointC.yPosition - pointA.yPosition) - (pointB.yPosition - pointA.yPosition) * (pointC.xPosition - pointA.xPosition)) > 0;
}


function isOutside(pointA, pointB, networkPlayerObject, objectInLoop)
{
    var bool = isLeft(pointA, pointB, objectInLoop)
    var objectPlayerAngle = Math.atan2((objectInLoop.yPosition - networkPlayerObject.yPosition), (objectInLoop.xPosition - networkPlayerObject.xPosition));
    if ((objectPlayerAngle > (Math.PI / 2)) && (bool == true)) // if the object is left of the corners and its angle is greater than 90, it's outside
    {
        return true;
    }
    if ((objectPlayerAngle < (Math.PI / 2)) && (objectPlayerAngle > 0) && (bool == false)) // if the object is right of the corners and its angle is less than 90, it's outside
    {
        return true;
    }
    if ((objectPlayerAngle == Math.Pi / 2) && (bool == true)) // if the object is above the corners and the corners are a horizontal line, then it's outside
    {
        return true;
    }
    else
    {
        return false;
    }
}


function zoomDimension(gameData, playerName, dimension) // current weapon is always the first in the array
{
    var variablePlayerObject = getObject(gameData.variableObject.playerArray, "objectName", playerName);
    var canvas = document.getElementById("canvasId");
    return canvas[dimension] * variablePlayerObject.weapon[0].zoom;
}


function viewAngle(gameData, playerName) // data structure (naming, particularly variablePlayerObject.mouseRight and variablePlayerObject.weapon.zoom) needs fixing
{
    var variablePlayerObject = getObject(gameData.variableObject.playerArray, "objectName", playerName);
    if (variablePlayerObject.weapon.zoom == 1) // player.weapon.zoom has to be in 1x, 2x, 4x, 8x, 16x
    {
        return convertAngleTo(15, "radians");
    }
    else
    {
        return (Math.PI / 2) - (2 * Math.atan(1 / variablePlayerObject.weapon.zoom)); // to test, do (pi/2 - 2*arctan(1/2)) * 180/pi on wolfram to get degree representation
    }
}


function filterCorners(gameData, playerName, variableMapObject) // variableMapObject.corners[] should be adjusted to be actual x/y coordinates of the corners of the variableMapObject, relative to the map origin and not mapObject.originX/Y, use find and replace in separate txt file for name changes
{
    var networkPlayerObject = getObject(gameData.networkObject.playerArray, "objectName", playerName);
    var distanceXAlpha = variableMapObject.corners[0].xPosition - networkPlayerObject.xPosition;
    var distanceYAlpha = variableMapObject.corners[0].yPosition - networkPlayerObject.yPosition;
    var distanceXBeta = variableMapObject.corners[1].xPosition - networkPlayerObject.xPosition;
    var distanceYBeta = variableMapObject.corners[1].yPosition - networkPlayerObject.yPosition;
    var angleAlpha = Math.atan2(distanceYAlpha, distanceXAlpha);
    var angleBeta = Math.atan2(distanceYBeta, distanceXBeta);
    var filteredResult;
    if (angleAlpha < angleBeta)
    {
        filteredResult = {"maxRight": variableMapObject.corners[0], "maxLeft": variableMapObject.corners[1]};
    }
    else
    {
        filteredResult = {"maxRight": variableMapObject.corners[1], "maxLeft": variableMapObject.corners[0]};
    }
    for (index = 2; index < variableMapObject.corners.length; index = index + 1) // tricky thing with Math.atan2() is that it returns 0 to PI in the top hemisphere, and -PI to 0 in the bottom hemisphere; good thing other filters already take out any objects in the lower quadrants
    {
        var distanceXGamma = variableMapObject.corners[index].xPosition - networkPlayerObject.xPosition;
        var distanceYGamma = variableMapObject.corners[index].yPosition - networkPlayerObject.yPosition;
        var angleGamma = Math.atan2(distanceYGamma, distanceXGamma);
        if (angleGamma < Math.atan2(filteredResult.maxRight.yPosition - networkPlayerObject.yPosition, filteredResult.maxRight.xPosition - networkPlayerObject.xPosition))
        {
            filteredResult.maxRight = variableMapObject.corners[index];
        }
        if (angleGamma > Math.atan2(filteredResult.maxLeft.yPosition - networkPlayerObject.yPosition, filteredResult.maxLeft.xPosition - networkPlayerObject.xPosition))
        {
            filteredResult.maxLeft = variableMapObject.corners[index];
        }
    }
    return filteredResult; // return an object with points maxRight and maxLeft, each with properties xPosition and yPosition
}


function withinFog(gameData, objectInLoop, playerName, variableMapObject) // this is if part of the map hasn't been explored yet, then it's black, may or may not implement
{
    return false; // placeholder for now, if removed, remove the call to the function inside the function filterSight()
}


function withinBlind(gameData, objectInLoop, playerName, variableMapObject) // where objectInLoop is any player or projectile object (but not mapObject)
{
    var networkPlayerObject = getObject(gameData.networkObject.playerArray, "objectName", playerName);
    var filteredResult = filterCorners(gameData, playerName, variableMapObject);
    var maxRight = filteredResult.maxRight;
    var maxLeft = filteredResult.maxLeft;
    var distanceXRight = maxRight.xPosition - networkPlayerObject.xPosition;
    var distanceYRight = maxRight.yPosition - networkPlayerObject.yPosition;
    var angleMaxRight = Math.atan2(distanceYRight, distanceXRight);
    var distanceXLeft = maxLeft.xPosition - networkPlayerObject.xPosition;
    var distanceYLeft = maxLeft.yPosition - networkPlayerObject.yPosition;
    var angleMaxLeft = Math.atan2(distanceYRight, distanceXRight);
    var objectPlayerAngle = Math.atan2((objectInLoop.yPosition - networkPlayerObject.yPosition), (objectInLoop.xPosition - networkPlayerObject.xPosition));
    if ((objectPlayerAngle < angleMaxLeft) && (objectPlayerAngle > angleMaxRight) && isOutside(maxLeft, maxRight, networkPlayerObject, objectInLoop))
    {
        return true;
    }
    else
    {
        return false;
    }
}





/////////////////////////////
//                         //
//  main filter functions  //
//                         //
/////////////////////////////


function filterSight(gameData, objectInLoop, playerName)
{
    var networkPlayerObject = getObject(gameData.networkObject.playerArray, "objectName", playerName);
    var variablePlayerObject = getObject(gameData.variableObject.playerArray, "objectName", playerName);
    var variableMapObject;
    var distanceX = objectInLoop.xPosition - networkPlayerObject.xPosition;
    var distanceY = -(objectInLoop.yPosition - networkPlayerObject.yPosition); // the screen origin starts at the upper left hand corner
//  var slope = distanceY / distanceX; // taken out for the time being because of dividing by 0 error
    var angle = Math.atan2(distanceY, distanceX); // tangent(theta) = y / x, so angle theta == arctangent(slope)
    for (index = gameData.variableObject.mapArray.length; index > 0; index = index - 1)
    {
        variableMapObject = gameData.variableObject.mapArray[index - 1];
        if (withinFog(gameData, objectInLoop, playerName, variableMapObject) || withinBlind(gameData, objectInLoop, playerName, variableMapObject))
        {
            return false;
        }
    }
    if (distance(distanceX, distanceY) < ((6.0/5.0) * (zoomDimension(gameData, playerName, "height"))) //circle definition, increased for aesthetics, later limited
      && (angle > viewAngle(gameData, playerName)) // arc specification, should be a radian measure
      && (angle < (Math.PI - viewAngle(gameData, playerName)))
      && (distanceX < ((zoomDimension(gameData, playerName, "width") / 2) + 25)) // right asymptote, 25 pixels for buffer in case object edges are in range
      && (distanceX > (-(zoomDimension(gameData, playerName, "width")) / 2) - 25) // left asymptote
      && (distanceY < (zoomDimension(gameData, playerName, "height") + 25)) // top asymptote
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


function filterActive(gameData, objectInLoop, playerName) // from variable array
{
    if (objectInLoop.active == true)
    {
        return true;
    }
}





//////////////////////////////////////////////////////////////////////
//                                                                  //
//  Ignore everything below. It is almost an exact identical copy,  //
//  but I needed to preserve just in case something goes wrong,     //
//  since I changed a lot of the syntax.                            //
//                                                                  //
//////////////////////////////////////////////////////////////////////





/*

Update Functions

Input Naming Conventions

objectArray: abstract term for any array of objects, ex. networkObject.playerArray[]
networkPlayerObject: current player object in frame, the input that the server sends to client, ex. networkObject.playerArray[0]
variablePlayerObject: current player data in frame that changes but does not need to be sent over network, ex. variableObject.playerArray[0]
objectInLoop: other objects in the objectArray, usually from the network array

For more information, read dataStructure.js

*/





/////////////////////////////
//                         //
//  main update functions  //
//                         //
/////////////////////////////


function update(name)
{
  filterMap(name)
  filterPlayer(name)
}


function filterMap(name)
{
  // blah blah
}


function filterPlayer(gameData, playerName)
{
  var filteredArray;
  filteredArray = filter(gameData.networkObject.playerArray, playerName, filterSight);
  filteredArray = filter(gameData.networkObject.playerArray, playerName, filterActive);
  return filteredArray;
}





///////////////////////////////////////
//                                   //
//  object-related helper functions  //
//                                   //
///////////////////////////////////////


function getObject(objectArray, propertyName, objectProperty) // returns the player object; need to fix if can not find object
{
  for (index = 0; index < objectArray.length; index = index + 1)
  {
    if (objectArray[index][propertyName] == objectProperty) // not sure how to make property a specification as a function parameter
    {
      return objectArray[index]; // should the objectArray be an array of objects, or a multidimensional array
    }
  }
}


function switchPosition(objectArray, position1, position2) // use this for switching weapons, where objectArray[0] represents the current weapon in use
{
  var placeholder = objectArray[position1];
  objectArray[position1] = objectArray[position2];
  objectArray[position2] = placeholder;
}





/////////////////////////////////////
//                                 //
//  math-related helper functions  //
//                                 //
/////////////////////////////////////


function distance(integer1, integer2)
{
  return Math.sqrt((integer1 * integer1) + (integer2 * integer2));
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


function slope(pointA, pointB)
{
  return (pointB.yPosition - pointA.yPosition) / (pointB.xPosition - pointA.xPosition); // how to fix denominator problem; update: fixed, use angle instead of slope
}


function isLeft(pointA, pointB, pointC) // source http://stackoverflow.com/questions/3461453/determine-which-side-of-a-line-a-point-lies
{
  return ((pointB.xPosition - pointA.xPosition) * (pointC.yPosition - pointA.yPosition) - (pointB.yPosition - pointA.yPosition) * (pointC.xPosition - pointA.xPosition)) > 0;
}


function isOutside(pointA, pointB, networkPlayerObject, objectInLoop)
{
  var bool = isLeft(pointA, pointB, objectInLoop)
  var objectPlayerAngle = Math.atan2((objectInLoop.yPosition - networkPlayerObject.yPosition), (objectInLoop.xPosition - networkPlayerObject.xPosition));
  if ((objectPlayerAngle > (Math.PI / 2)) && (bool == true)) // if the object is left of the corners and its angle is greater than 90, it's outside
  {
    return true;
  }
  if ((objectPlayerAngle < (Math.PI / 2)) && (objectPlayerAngle > 0) && (bool == false)) // if the object is right of the corners and its angle is less than 90, it's outside
  {
    return true;
  }
  if ((objectPlayerAngle == Math.Pi / 2) && (bool == true)) // if the object is above the corners and the corners are a horizontal line, then it's outside
  {
    return true;
  }
  else
  {
    return false;
  }
}





///////////////////////////////////////
//                                   //
//  filter-related helper functions  //
//                                   //
///////////////////////////////////////


function filter(objectArray, objectName, filterFunction) // should consider creating a filter object to loop through the filter methods
{
  var index = objectArray.length;
  var playerObject = getObject(objectArray, "objectName", objectName); // getting player object, using objectArray, where objectArray is commonly networkObject.playerArray
  var filteredArray = objectArray.slice(0); // setting new array object so that the initial one won't be affected
  while (index > 0) // basic loop through objects of array
  {
    if (filterFunction(filteredArray[index], playerObject) == false)
    {
      filteredArray.splice(index, 1); // remove the object from array if conditions do not satisfy
    }
    index = index - 1; // increment
  }
  return filteredArray;
}


function display(objectArray) // input the filtered object array after calling the function filter(), not the individual objects
{
  for (index = 0; index > objectArray.length; index = index + 1) // apparently, creating new functions using a for loop doesn't work
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


function filterSight(objectInLoop, variableMapObject, networkPlayerObject, variablePlayerObject)
{
  var distanceX = objectInLoop.xPosition - networkPlayerObject.xPosition;
  var distanceY = -(objectInLoop.yPosition - networkPlayerObject.yPosition); // the screen origin starts at the upper left hand corner
  // var slope = distanceY / distanceX; // taken out for the time being because of dividing by 0 error
  var angle = Math.atan2(distanceY, distanceX); // tangent(theta) = y / x, so angle theta == arctangent(slope)
  if (withinFog(objectInLoop, variableMapObject, networkPlayerObject) || withinBlind(objectInLoop, variableMapObject, networkPlayerObject))
  {
    return false;
  }
  if (distance(distanceX, distanceY) < ((6.0/5.0) * (zoomDimension(variablePlayerObject, "height"))) //circle definition, increased for aesthetics, later limited
    && (angle > viewAngle(variablePlayerObject)) // arc specification, should be a radian measure
    && (angle < (Math.PI - viewAngle(variablePlayerObject)))
    && (distanceX < ((zoomDimension(variablePlayerObject, "width") / 2) + 25))// right asymptote, 25 pixels for buffer in case object edges are in range
    && (distanceX > (-(zoomDimension(variablePlayerObject, "width")) / 2) - 25)// left asymptote
    && (distanceY < (zoomDimension(variablePlayerObject, "height") + 25)) // top asymptote
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


function zoomDimension(variablePlayerObject, dimension) // current weapon is always the first in the array
{
  var canvas = document.getElementById("canvasId");
  return canvas[dimension] * variablePlayerObject.weapon[0].zoom;
}


function withinFog(objectInLoop, variableMapObject, networkPlayerObject) // this is if part of the map hasn't been explored yet, then it's black, may or may not implement
{
  return false; // placeholder for now, if removed, remove the call to the function inside the function filterSight()
}


function withinBlind(objectInLoop, variableMapObject, networkPlayerObject) // where objectInLoop is any player or projectile object (but not mapObject)
{
  var filteredResult = filterCorners(variableMapObject, networkPlayerObject);
  var maxRight = filteredResult.maxRight;
  var maxLeft = filteredResult.maxLeft;
  var distanceXRight = maxRight.xPosition - networkPlayerObject.xPosition;
  var distanceYRight = maxRight.yPosition - networkPlayerObject.yPosition;
  var angleMaxRight = Math.atan2(distanceYRight, distanceXRight);
  var distanceXLeft = maxLeft.xPosition - networkPlayerObject.xPosition;
  var distanceYLeft = maxLeft.yPosition - networkPlayerObject.yPosition;
  var angleMaxLeft = Math.atan2(distanceYRight, distanceXRight);
  var objectPlayerAngle = Math.atan2((objectInLoop.yPosition - networkPlayerObject.yPosition), (objectInLoop.xPosition - networkPlayerObject.xPosition));
  if ((objectPlayerAngle < angleMaxLeft) && (objectPlayerAngle > angleMaxRight) && isOutside(maxLeft, maxRight, networkPlayerObject, objectInLoop))
  {
    return true;
  }
  else
  {
    return false;
  }
}


function viewAngle(variablePlayerObject) // data structure (naming, particularly variablePlayerObject.mouseRight and variablePlayerObject.weapon.zoom) needs fixing
{
  if (variablePlayerObject.weapon.zoom == 1) // player.weapon.zoom has to be in 1x, 2x, 4x, 8x, 16x
  {
    return convertAngleTo(15, "radians");
  }
  else
  {
    return (Math.PI / 2) - (2 * Math.atan(1 / variablePlayerObject.weapon.zoom)); // to test, do (pi/2 - 2*arctan(1/2)) * 180/pi on wolfram to get degree representation
  }
}


function filterActive(objectInLoop) // from variable array
{
  if (objectInLoop.active == true)
  {
    return true;
  }
}


function filterCorners(variableMapObject, networkPlayerObject) // variableMapObject.corners[] should be adjusted to be actual x/y coordinates of the corners of the variableMapObject, relative to the map origin and not mapObject.originX/Y, use find and replace in separate txt file for name changes
{
  var distanceXAlpha = variableMapObject.corners[0].xPosition - networkPlayerObject.xPosition;
  var distanceYAlpha = variableMapObject.corners[0].yPosition - networkPlayerObject.yPosition;
  var distanceXBeta = variableMapObject.corners[1].xPosition - networkPlayerObject.xPosition;
  var distanceYBeta = variableMapObject.corners[1].yPosition - networkPlayerObject.yPosition;
  var angleAlpha = Math.atan2(distanceYAlpha, distanceXAlpha);
  var angleBeta = Math.atan2(distanceYBeta, distanceXBeta);
  var filteredResult;
  if (angleAlpha < angleBeta)
  {
    filteredResult = {"maxRight": variableMapObject.corners[0], "maxLeft": variableMapObject.corners[1]};
  }
  else
  {
    filteredResult = {"maxRight": variableMapObject.corners[1], "maxLeft": variableMapObject.corners[0]};
  }
  for (index = 2; index < variableMapObject.corners.length; index = index + 1) // tricky thing with Math.atan2() is that it returns 0 to PI in the top hemisphere, and -PI to 0 in the bottom hemisphere; good thing other filters already take out any objects in the lower quadrants
  {
    var distanceXGamma = variableMapObject.corners[index].xPosition - networkPlayerObject.xPosition;
    var distanceYGamma = variableMapObject.corners[index].yPosition - networkPlayerObject.yPosition;
    var angleGamma = Math.atan2(distanceYGamma, distanceXGamma);
    if (angleGamma < Math.atan2(filteredResult.maxRight.yPosition - networkPlayerObject.yPosition, filteredResult.maxRight.xPosition - networkPlayerObject.xPosition))
    {
      filteredResult.maxRight = variableMapObject.corners[index];
    }
    if (angleGamma > Math.atan2(filteredResult.maxLeft.yPosition - networkPlayerObject.yPosition, filteredResult.maxLeft.xPosition - networkPlayerObject.xPosition))
    {
      filteredResult.maxLeft = variableMapObject.corners[index];
    }
  }
  return filteredResult; // return an object with points maxRight and maxLeft, each with properties xPosition and yPosition
}