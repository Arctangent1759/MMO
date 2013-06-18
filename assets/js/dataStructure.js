// FOR LOCAL WEAPONOBJECT
function createWeaponObject(objectName, spriteLink, xOrigin, yOrigin, projectile, weight, magazineSize, magazineMax, firingRate, firingModes, firingAccuracy, recoilHip, recoilScope, recoilMove, reloadTime)
{
    this.objectName = objectName;
    this.spriteLink = spriteLink;
    this.projectile = projectile;
    this.weight = weight;
    this.collision = function(networkPlayerObject)
    {
        // box2d writes this?
    }

    this.magazineSize = magazineSize;
    this.magazineMax = magazineMax;

    this.firingRate = firingRate;
    this.firingModes = firingModes;
    this.firingAccuracy = firingAccuracy;
    this.fire = function(variablePlayerObject, networkPlayerObject) // where networkPlayerObject is an element of the array playerObject[] for network
    {
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

    this.recoilFunction = function(variablePlayerObject, networkPlayerObject)
    {
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
    this.reloadWeapon = function(variablePlayerObject) // where variablePlayerObject is an element of the array playerObject[] for client variables
    {
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
NETWORK ARRAY
// data constantly sent over network

playerObject
    .objectName // update061713: changed name from "name" to "objectName" because "name" is already a keyword
    .xPosition
    .yPosition
    .angle
    .health

    .kills
    .deaths
    .ping
    
    .projectile
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
  "projectile":
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

weaponObject
    .objectName // update061713: changed name from "name" to "objectName" because "name" is already a keyword

    .magazineCurrent
    .magazineCount
    
    .zoom // right click event

projectileObject
    .objectName // update061713: changed name from "name" to "objectName" because "name" is already a keyword
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
    .firingAccuracy // default accuracy, adjusted by recoil over time
    
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