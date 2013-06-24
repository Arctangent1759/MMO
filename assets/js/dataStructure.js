// CIRCLE EXAMPLE OF CORNERS
function addCorner(cornerArray, xPosition, yPosition)
{
  var index = cornerArray.length
  cornerArray[index] = {"xPosition": xPosition, "yPosition": yPosition};
}


function floorTowardsZero(position) // to make so rounding isn't one sided
{
  var flooredPosition = position;
  if (flooredPosition < 0)
  {
    flooredPosition = -(Math.floor(-flooredPosition));
  }
  else
  {
    flooredPosition = Math.floor(flooredPosition);
  }
  return flooredPosition;
}


function createCircle(radius)
{
  var cornerArray = new Array();
  var xPosition;
  var yPosition;
  for (index = 360; index > 0; index = index - 1) // for finer edges or larger circles, increase
  {
    xPosition = radius * Math.cos(index * (Math.PI / 180));
    yPosition = radius * Math.sin(index * (Math.PI / 180));
    xPosition = floorTowardsZero(xPosition);
    yPosition = floorTowardsZero(yPosition);
    addCorner(cornerArray, xPosition, yPosition);
  }
  return cornerArray;
}


function shiftCorners(cornerArray, distanceX, distanceY) // shift from origin at 0, 0 to top-left corner, whilst inverting the y axis
{
  var shiftedArray = cornerArray;
  for (index = cornerArray.length; index > 0; index = index - 1)
  {
    shiftedArray[index - 1].xPosition = shiftedArray[index - 1].xPosition + distanceX;
    shiftedArray[index - 1].yPosition = -(shiftedArray[index - 1].yPosition - distanceY);
  }
  return shiftedArray;
}


function drawShape(cornerArray, imageData, red, green, blue, alpha)
{
  for (index = 0; index < cornerArray.length; index = index + 1)
  {
    var pixelIndex = cornerArray[index].xPosition + ((cornerArray[index].yPosition - 1) * 100);
    imageData.data[4 * pixelIndex + 0] = red;
    imageData.data[4 * pixelIndex + 1] = green;
    imageData.data[4 * pixelIndex + 2] = blue;
    imageData.data[4 * pixelIndex + 3] = alpha;
  }
}


// to actually display
var Circle = new createCircle(50);
var shiftedCircle = shiftCorners(Circle, 50, 50);

var canvas = document.getElementById("canvasID");
var ctx = canvas.getContext("2d");
var imgData = ctx.createImageData(100, 100);

drawShape(shiftedCircle, imgData, 255, 0, 0, 255);
ctx.putImageData(imgData, 10, 10);










// FOR LOCAL PROJECTILEOBJECT
function createProjectileObject(objectName, spriteLink, xOrigin, yOrigin, mass, corners, damage, velocity, deceleration, maxRange, explosiveRadius, explosiveTimer)
////////////////////////////////////////////////
//                                            //
//  Inputs (Ordered)                          //
//  objectName, spriteLink                    //
//  xOrigin, yOrigin, mass                    //
//  corners
//  damage, velocity, deceleration, maxRange  //
//  explosiveRadius, explosiveTimer           //
//                                            //
////////////////////////////////////////////////
{
    this.objectName = objectName;
    this.spriteLink = spriteLink;
    this.xOrigin = xOrigin;
    this.yOrigin = yOrigin;
    this.mass = mass;

    this.corners = corners;
    this.extension = function() // how to get function to run only once and put return value in variable?
    {
        var longestRadius = 0;
        for (index0 = this.corners.length; index0 > 0; index0 = index0 - 1)
        {
            if (longestRadius < distance(this.corners[index0].xPosition, this.corners[index0].yPosition))
            {
                longestRadius = distance(this.corners[index0].xPosition, this.corners[index0].yPosition);
            }
        }
        return longestRadius;
    }
    this.collision = function(networkObject1, networkObject2, localObject2) // localObject1 is this
    {
        var extensionThis = this.extension();
        var extensionThat = localObject2.extension();
        if (extensionThis + extensionThat > distance(networkObject1.xPosition + networkObject2.xPosition, networkObject1.yPosition + networkObject2.yPosition)) // checking if the objects are even close enough to consider collision
        {
            return false;
        }
        for (index1 = localObject2.corners.length; index1 > 0; index1 = index1 - 1)
        {
            for (index2 = this.corners.length; index2 > 0; index2 = index2 - 1)
            {
                if ((networkObject2.xPosition + localObject2.corners[index1].xPosition = networkObject1.xPosition + this.corners[index2].yPosition)
                && (networkObject2.yPosition + localObject2.corners[index1].yPosition = networkObject1.xPosition + this.corners[index2].yPosition)) // check if the corners of network objects are equal to each other
                {
                    return true;
                }
            }
        }
        return false;
    }

    this.damage = damage;
    this.velocity = velocity;
    this.deceleration = deceleration;
    this.maxRange = maxRange;

    this.explosiveRadius = explosiveRadius;
    this.explosiveTimer = explosiveTimer;
}





// FOR LOCAL WEAPONOBJECT
function createWeaponObject(objectName, spriteLink, xOrigin, yOrigin, projectile, weight, corners, magazineSize, magazineMax, firingRate, firingModes, recoilHip, recoilScope, recoilMove, reloadTime)
////////////////////////////////////////////
//                                        //
//  Inputs (Ordered)                      //
//  objectName, spriteLink                //
//  xOrigin, yOrigin, projectile, weight  //
//  corners                               //
//  magazineSize, magazineMax             //
//  firingRate, firingModes               //
//  recoilHip, recoilScope, recoilMove    //
//  reloadTime                            //
//                                        //
////////////////////////////////////////////
{
    this.objectName = objectName;
    this.spriteLink = spriteLink;
    this.xOrigin = xOrigin;
    this.yOrigin = yOrigin;
    this.projectile = projectile;
    this.weight = weight;

    this.corners = corners;
    this.extension = function() // how to get function to run only once and put return value in variable?
    {
        var longestRadius = 0;
        for (index0 = this.corners.length; index0 > 0; index0 = index0 - 1)
        {
            if (longestRadius < distance(this.corners[index0].xPosition, this.corners[index0].yPosition))
            {
                longestRadius = distance(this.corners[index0].xPosition, this.corners[index0].yPosition);
            }
        }
        return longestRadius;
    }    
    this.collision = function(gameData, playerName)
    {
        // box2d writes this?
    }

    this.magazineSize = magazineSize;
    this.magazineMax = magazineMax;

    this.firingRate = firingRate;
    this.firingModes = firingModes;
    this.fire = function(gameData, playerName) // where networkPlayerObject is an element of the array playerObject[] for network
    {
        var networkPlayerObject = getObject(gameData.networkObject.playerArray, "objectName", playerName);
        var variablePlayerObject = getObject(gameData.variableObject.playerArray, "objectName", playerName);
        var arrayIndex = networkPlayerObject.projectile.length;
        var projectileObject;
        while (arrayIndex > 0)
        {
            if (networkPlayerObject.projectile[arrayIndex].objectName == this.projectile)
            {
                projectileObject = networkPlayerObject.projectile[arrayIndex];
                break;
            }
            else
            {
                arrayIndex = arrayIndex - 1;
            }
            if (projectileObject == null)
            {
                networkPlayerObject.projectile[networkPlayerObject.projectile.length] =
                {
                    "objectName": this.projectile,
                    "xPosition": new Array(),
                    "yPosition": new Array(),
                    "angle": new Array()
                };
                projectileObject = networkPlayerObject.projectile[networkPlayerObject.projectile.length - 1];
            }
        }
        var newPosition = projectileObject.angle.length;
        projectileObject.xPosition[newPosition] = networkPlayerObject.xPosition + this.xOrigin; // origin needs establishing
        projectileObject.yPosition[newPosition] = networkPlayerObject.yPosition + this.yOrigin;
        projectileObject.angle[newPosition] = networkPlayerObject.angle + this.recoilFunction(variablePlayerObject, networkPlayerObject);
    }

    this.recoilHip = recoilHip; // in radians, such as 0.04
    this.recoilScope = recoilScope; // such as 0.025
    this.recoilMove = recoilMove;
    this.recoilFunction = function(gameData, playerName)
    {
        var networkPlayerObject = getObject(gameData.networkObject.playerArray, "objectName", playerName);
        var variablePlayerObject = getObject(gameData.variableObject.playerArray, "objectName", playerName);
        var defaultRecoil;
        var moveAdjust;
        var timeAdjust;
        if (networkPlayerObject.zoom == true)
        {
            defaultRecoil = this.recoilScope
        }
        else
        {
            defaultRecoil = this.recoilHip
        }
        if (variablePlayerObject.move == true)
        {
            moveAdjust = this.recoilMove;
        }
        else
        {
            moveAdjust = 0;
        }
        if (variablePlayerObject.clickTime > 3000)
        {
            timeAdjust = (3000 * 0.001) / 200; // was going to make this a more complex function, but a linear increase makes sense too
        }
        else
        {
            timeAdjust = (variablePlayerObject.clickTime * 0.001) / 200;
        }
        var sumRecoil = defaultRecoil + moveAdjust + timeAdjust;
        return (Math.random() * 2 * sumRecoil) - sumRecoil; // if the accuracy presents a problem, use Math.floor after multiplying everything by 100000, and then divide again by 100000 (4 significant figures)
    }

    this.reloadTime = reloadTime;
    this.reloadWeapon = function(gameData, playerName) // where variablePlayerObject is an element of the array playerObject[] for client variables
    {
        var variablePlayerObject = getObject(gameData.variableObject.playerArray, "objectName", playerName);
        if ((variablePlayerObject.magazineCurrent < this.magazineSize) && (variablePlayerObject.magazineCount > 0))
        {
            setTimeout(function()
            {
                variablePlayerObject.magazineCurrent = this.magazineSize;
                variablePlayerObject.magazineCount = clientPlayerObject.magazineCount - 1;
                // reload animation (if existent) goes before the setTimeout
                // player screen must constantly be updating magazineCurrent and magazineCount
            }, this.reloadTime) // average weapon reload time for most games is around 3500 milliseconds
        }
    }
}








/*
Below are three sets of arrays: network output, client, and local cache.
- network output is any data in need of constantly sending from server to client
- client is any data that changes but does not need to be sent to other players (ex. whether you are scoping, since the key presses will be relayed to server and they will adjust your projectile accuracies, but other players don't need to know this bool value)
- local cache is any data that will never ever be changed (except for balancing), and will be stored on the player's computer
This is an unfinished reference document; when you write your functions, use the property and method names here.
If you use a different parameter for the methods (since they are not well defined yet), add to this document, and make a comment of what you changed.
If you decide to add or remove any properties or methods, make a comment of what you changed and why.
Specifically, the client array has not been addressed yet, so needs to be done.
Eventually, what we want to do is, after creating a solid data structure, to make constructor functions for JSON objects with these properties and methods.
Note the spacing; 4 line breaks between the sets of arrays, 1 between the individual arrays, and 1 line break wherever appropriate for organization
*/




/*
FORMATTING OF ALL DATA
gameData
    .networkObject
        .playerArray[] // array of objects, each of which contains the following and a weapon property that is simply a reference to gameData.localObject.weaponObject
            .projectileArray[]
        .mapArray[] // might not include if map won't change
        .serverArray[]
    .variableObject
        .playerArray[] // array of objects, each of which contains the following
            .weaponObject // contains a projectile property that is simply a reference to gameData.localObject.projectileObject
                .projectileObject
        .mapArray[] // array of map objects, each of which has several instances of each kind of object
            .mapObject // has objectName, xPosition, yPosition
    .localObject
        .playerObject
        .weaponObject
        .equipmentObject
        .projectileObject
        .mapObject
*/




/*
NETWORK ARRAY
// data constantly sent over network

playerObject
    .objectName // update061713: changed name from "name" to "objectName" because "name" is already a keyword
    .xPosition
    .yPosition
    .angle
    .health
    .weapon

    .kills
    .deaths
    .ping
    
    .weapon // name of weapon
    .projectileArray[]
        .objectName // update061713: changed name from "name" to "objectName" because "name" is already a keyword
        .xPosition[]
        .yPosition[]
        .angle

mapObject
    .cornerAdd[{}, {}, {}, etc.] // there is some serverside function that takes an impact point as input, generated from the physics dept, to determine exactly what points to add and delete to simulate destruction
    .cornerDelete[{}, {}, {}, etc.]

serverObject
    .scoreRed
    .scoreBlue
    .timeLeft
*/

/*
// example

playerObject[0] ==
{
  "objectName": "William",
  "xPosition": 69,
  "yPosition": 169,
  "angle": 0,
  "health": 69,
  "weapon": "gun",
  "projectileArray":
  [
    {
      "objectName": "bullet",
      "xPosition": [69, 69, 69, 69, 69],
      "yPosition": [189, 209, 229, 249, 269],
      "angle": [0, 0, 0, 0, 0]
    },
    {
      "objectName": "grenade",
      "xPosition": [100, 110],
      "yPosition": [100, 95],
      "angle": [null, null]
    }
  ]
}
*/

/*
- this playerObject above is a player with name William, location (69, 169), angle of 0 degrees, 69 percent health, in current posession of 5 bullets and 2 grenades on map
- to access the ypos of grenade1
    - playerObject[0].projectile[1].ypos[0]
- according to mothereff.in/byte-counter, this object (with the parentheses and brackets and stuff) is approximately 400 bytes (387)
    - a server of 100 players will have to transmit 40 kilobytes per second to each player
    - if the property identifiers are shortened to characters (instead of full names), we can save about 100 bytes
    - if we remove the formatting, we can save more bytes, but expect a minimum of at least 100 bytes per player
*/




/*
VARIABLE ARRAY
// properties that change often but are not sent over network

playerObject
    .objectName // update061713: changed name from "name" to "objectName" because "name" is already a keyword
    .active // bool, if it doesn't exist in network array, then it is false and dead

    .move // bool, true if player position is different from last frame
    .clickTime // time since mouseleftclick up, use http://stackoverflow.com/questions/6472707/how-to-get-info-on-what-key-was-pressed-on-for-how-long

    .weapon // array of weapon objects, as listed below

weaponObject
    .objectName // update061713: changed name from "name" to "objectName" because "name" is already a keyword

    .magazineCurrent
    .magazineCount
    
    .zoom // current zoom (does not matter if right click is pressed, some other maths function will manipulate this property)
    
    .projectile // name of local projectile object

projectileObject
    .objectName // update061713: changed name from "name" to "objectName" because "name" is already a keyword

mapObject // each array of mapObjects is a map
    .objectName

    .xPosition
    .yPosition
*/




/*
LOCAL ARRAY
// fixed data, for reference only

playerObject
    .objectName // update061713: changed name from "name" to "objectName" because "name" is already a keyword
    .spriteLink // all link properties are references to img sprites; update061713: changed name from "link" to "spriteLink" because "link" is already a keyword
    .corners[{}, {}, {}, etc.] // each curly brace is supposed to have xPosition: number1, yPosition: number2
    .xOrigin // center point of object, corners are defined relative to this
    .yOrigin
    .collision(object)

    .acceleration
    .moveSpeed
    .turnSpeed(integer) // function based on the sensitivity settings specified by the player

weaponObject
    .objectName // update061713: changed name from "name" to "objectName" because "name" is already a keyword
    .spriteLink // update061713: changed name from "link" to "spriteLink" because "link" is already a keyword
    .corners[{}, {}, {}, etc.]
    .xOrigin // point at which projectiles are initialized (to make it seem like actually shooting), the shift from the top left corner of playerObject.xOrigin
    .yOrigin
    .projectile // will later match to projectileObject.name, only one per weaponObject
    .weight // heavy weapons slow down player
    .collision(object)

    .magazineSize
    .magazineMax
    
    .fire() // create a new projectileObject
    .firingRate // in rounds per second
    .firingModes // single == 1, burst == 2, automatic == 4, firingMode represents sum, so 1 == single, 2 == burst, 3 == single + burst, 4 == automatic, 5 == single + automatic, 6 == burst + automatic, 7 == all modes available    
 
    .recoilFunction() // logarithmic function of time, approaching limit of inaccuracy
    .recoilHip // max angle value in radians that the projectile will be inaccurate to
    .recoilScope
    .recoilMove // adjusts recoil based on whether moving or not
    .scopeTypes // 1, 2, 4, 8, 16, sum represents scopeTypes available; 1 == 1, 2 == 2, 3 == 1 + 2, 4 == 4, 5 == 1 + 4, 6 == 2 + 4, 7 == 1 + 2 + 4, etc.
    
    .reloadTime // in seconds; update061713: changed name from "reloadRate" to "reloadTime"
    .reloadWeapon() // update061713: changed name from "reload" to "reloadWeapon" because "reload" is already a keyword

equipmentObject
    .flashlight()
    .laserSight()
    .nightVision() // invert colors, should be easy as 256 - pixel.color
    .silencer()

projectileObject
    .objectName // update061713: changed name from "name" to "objectName" because "name" is already a keyword
    .spriteLink // update061713: changed name from "link" to "spriteLink" because "link" is already a keyword
    .corners[{}, {}, {}, etc.]
    .xOrigin // point to match with weaponObject.xOrigin (and yOrigin) for simulated firing
    .yOrigin
    .collision(object)

    .damage
    .mass // [if we try to implement] determines how far bullet can travel through mapObjects
    .velocity
    .deceleration
    .maxRange // to prevent projectiles going infinitely

    .explosiveRadius // default is 0, single point damage
    .explosiveTimer // how long after impact or 0 velocity the projectile will execute explosion

mapObject
    .objectName // update061713: changed name from "name" to "objectName" because "name" is already a keyword
    .spriteLink // update061713: changed name from "link" to "spriteLink" because "link" is already a keyword
    .corners[{xPosition: 0, yPosition: 0}, {xPosition: 0, yPosition: 10}, {xPosition: 10, yPosition: 10}, {xPosition: 10, yPosition: 0}] // sample array of rectangle
    .xOrigin // point at which corners are defined relative to, and also represents object center
    .yOrigin
    .collision(object)
    .cornerAdd(xPosition, yPosition)
    .cornerDelete(xPosition, yPosition) // alternatively, create function editPixels(xPosition, yPosition)
*/