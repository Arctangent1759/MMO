// JSFIDDLE LINK: http://jsfiddle.net/QDSpG/8/


// CIRCLE EXAMPLE OF CORNERS
function distance(integer1, integer2) // this function here because needed for something referenced
{
    return Math.sqrt((integer1 * integer1) + (integer2 * integer2));
}


function addCorner(cornerArray, xPosition, yPosition)
{
    var index = cornerArray.length
    cornerArray[index] = {"xPosition": xPosition, "yPosition": yPosition};
}


function mergeCorners(cornerArray1, cornerArray2)
{
    var returnArray = new Array();
    for (index = 0; index < cornerArray1.length; index = index + 1)
    {
        returnArray.push(cornerArray1[index]);
    }
    for (index = 0; index < cornerArray2.length; index = index + 1)
    {
        returnArray.push(cornerArray2[index]);
    }
    return returnArray;
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
    var circumference = (10 * radius) // circumference is Math.PI * 2 * radius, but to make sure all the edges are connected, increased factor to 10 * radius
    while ((360000 % (circumference)) != 0) // the reason this is 360000 is because 360 degrees times 1000, since index has to be an integer in a for loop, but I need it to do more iterations
    {
        circumference = circumference + 1; // increase circumference by minute amount to make it so it's divisible
    }
    var iteration = 360000 / circumference;
    for (index = 360000; index > 0; index = index - iteration) // for finer edges or larger circles, increase
    {
        xPosition = radius * Math.cos((index / 1000) * (Math.PI / 180));
        yPosition = radius * Math.sin((index / 1000) * (Math.PI / 180));
        xPosition = floorTowardsZero(xPosition);
        yPosition = floorTowardsZero(yPosition);
        cornerArray.push({"xPosition": xPosition, "yPosition": yPosition}); // removed previous checking method because js equivalency doesn't extend to objects
    }
    var returnArray = new Array();
    var index1 = 0;
    var index2 = 0;
    var bool = true;
    while (index1 < cornerArray.length)
    {
        bool = true;
        index2 = 0;
        while (index2 < returnArray.length)
        {
            if (cornerArray[index1].xPosition == returnArray[index2].xPosition && cornerArray[index1].yPosition == returnArray[index2].yPosition)
            {
                bool = false;
                break;
            }
            index2 = index2 + 1;
        }
        if (bool == true)
        {
            returnArray.push(cornerArray[index1]);
        }
        index1 = index1 + 1;
    }
    return returnArray;
}


function createLine(pointA, pointB) // to be done
{
    var slope = (pointB.yPosition - pointA.yPosition) / (pointB.xPosition - pointA.xPosition);   
}


function createSquare(radius)
{
    var cornerArray = new Array();
    var xPosition = radius;
    var yPosition = radius;
    while (yPosition > -(radius))
    {
        cornerArray.push({"xPosition": xPosition, "yPosition": yPosition});
        yPosition = yPosition - 1;
    }
    while (xPosition > -(radius))
    {
        cornerArray.push({"xPosition": xPosition, "yPosition": yPosition});
        xPosition = xPosition - 1;
    }
    while (yPosition < radius)
    {
        cornerArray.push({"xPosition": xPosition, "yPosition": yPosition});
        yPosition = yPosition + 1;
    }
    while (xPosition < radius)
    {
        cornerArray.push({"xPosition": xPosition, "yPosition": yPosition});
        xPosition = xPosition + 1;
    }
    return cornerArray;
}


function createTriangle(radius)
{
    var cornerArray = new Array();
    var xPosition = 0;
    var yPosition = radius;
    var index = 0;
    while (xPosition < ((Math.sqrt(3) / 2) * radius))
    {
        cornerArray.push({"xPosition": xPosition, "yPosition": yPosition});
        yPosition = yPosition - 1;
        if (index == 2)
        {
            xPosition = xPosition + 1;
            index = -1;
        }
        index = index + 1;
    }
    while (xPosition > (-(Math.sqrt(3) / 2) * radius))
    {
        cornerArray.push({"xPosition": xPosition, "yPosition": yPosition});
        xPosition = xPosition - 1;
    }
    index = 0;
    while (xPosition < 0)
    {
        cornerArray.push({"xPosition": xPosition, "yPosition": yPosition});
        yPosition = yPosition + 1;
        if (index == 2)
        {
            xPosition = xPosition + 1;
            index = -1;
        }
        index = index + 1;
    }
    return cornerArray;
}


function shiftCorners(cornerArray, distanceX, distanceY) // shift from origin at 0, 0 to top-left corner, whilst inverting the y axis
{
    var shiftedArray = cornerArray;
    for (index = cornerArray.length; index > 0; index = index - 1)
    {
        shiftedArray[index - 1].xPosition = shiftedArray[index - 1].xPosition + distanceX;
        shiftedArray[index - 1].yPosition = -(shiftedArray[index - 1].yPosition - (distanceY + 1)); // the plus one is because coordinates with 0 will not show
    }
    return shiftedArray;
}


function shiftArray(cornerArray, distanceX, distanceY) // consistent with the common 'positive is up' screen x and y orientation
{
    var shiftedArray = cornerArray;
    for (index = 0; index < cornerArray.length; index = index + 1)
    {
        shiftedArray[index].xPosition = shiftedArray[index].xPosition + distanceX;
        shiftedArray[index].yPosition = shiftedArray[index].yPosition + distanceY;
    }
    return shiftedArray;
}


function invertArray(cornerArray)
{
    var invertedArray = cornerArray;
    for (index = 0; index < cornerArray.length; index = index + 1)
    {
        invertedArray[index].yPosition = -invertedArray[index].yPosition;
    }
    return invertedArray;
}


function drawShape(cornerArray, imageData, red, green, blue, alpha)
{
    for (index = 0; index < cornerArray.length; index = index + 1)
    {
        var pixelIndex = cornerArray[index].xPosition + ((cornerArray[index].yPosition - 1) * imageData.width); // imageData.width is how many full lines you need to move
        imageData.data[4 * pixelIndex + 0] = red;
        imageData.data[4 * pixelIndex + 1] = green;
        imageData.data[4 * pixelIndex + 2] = blue;
        imageData.data[4 * pixelIndex + 3] = alpha;
    }
//    for (index = 0; index < imageData.data.length; index = index + 4) // to get rid of whitespace in the imageData, unfortunately doesn't work yet
//    {
//        var color = imageData.data[index]
//        if (imageData.data[index + 0] == color && imageData.data[index + 1] == color && imageData.data[index + 2] == color)
//        {
//            imageData.data[index + 3] = 0;
//        }
//    }
//    for (index = 0; index < imageData.data.length; index = index + 1)
//    {
//        if (imageData.data[index] == 255 && ((index + 1) % 4 == 0) && imageData.data[index - 1] == 0 && imageData.data[index - 2] == 0 && imageData.data[index - 3] == 0)
//        {
//            imageData.data[index] = 0;
//        }
//    }
}



////////////////////////
//  simple collision  //
////////////////////////

var circle = new createPlayerObject("Circle", undefined, 0, 0, createCircle(50), 10, 10, 10);
var square = new createPlayerObject("Square", undefined, 0, 0, createSquare(69), 10, 10, 10);
networkObject1 = {"xPosition": 0, "yPosition": 0};
networkObject2 = {"xPosition": 0, "yPosition": 100};
console.log(circle.collision(networkObject1, networkObject2, square));

// or what we could do is have a separate js file made for physics, and put all the collision stuff in there, since a lot of the functions are repeated
// create an object from object constructor function physics, such that the prototype is: physics.collision(networkObject1, networkObject2, localObject1, localObject2)





//////////////////////
//  simple drawing  //
//////////////////////

var circle = new createCircle(50);
var shiftedCircle = shiftCorners(circle, 50, 50);
var square = new createSquare(50);
var shiftedSquare = shiftCorners(square, 50, 50);
var triangle = new createTriangle(50);
var shiftedTriangle = shiftCorners(triangle, 44, 50);

var canvas = document.getElementById("canvasID");
var ctx = canvas.getContext("2d");

var circleData = ctx.createImageData(150, 150);
var squareData = ctx.createImageData(150, 150);
var triangleData = ctx.createImageData(150, 150);

drawShape(shiftedCircle, circleData, 255, 0, 0, 255);
drawShape(shiftedSquare, squareData, 255, 0, 0, 255);
drawShape(shiftedTriangle, triangleData, 255, 0, 0, 255);
ctx.putImageData(circleData, 0, 0);
ctx.putImageData(squareData, 150, 150);
ctx.putImageData(triangleData, 300, 300);

// instead of doing the repetitive code, a for loop on an array of objects will be done instead (in the actual game)
// triangle has bad angles, need to figure out how to make it equilateral









// where html == <canvas id="canvasID" width="500" height="500"></canvas>

// object creation
var circle = new createPlayerObject("circle", undefined, 0, 0, createCircle(50), 10, 10, 10);
var square = new createPlayerObject("square", undefined, 0, 0, createSquare(50), 10, 10, 10); // stationary object in this test
circle.corners = shiftCorners(circle.corners, 50, 50)
square.corners = shiftCorners(square.corners, 50, 50)

// location setting
var tempX = 0 - circle.radius; // this block must be after the declaration of the playerObject, since it references the radius of a circle that hasn't been declared yet
var tempY = 0 - circle.radius;
var fixedX = 250 - square.radius;
var fixedY = 250 - square.radius;
var changeX = 0;
var changeY = 0;

// canvas creation
var canvas = document.getElementById("canvasID");
var ctx = canvas.getContext("2d");
var canvasData = ctx.createImageData(canvas.width, canvas.height);
drawShape(shiftCorners(circle.corners, changeX, changeY), canvasData, 255, 0, 0, 255);
ctx.putImageData(canvasData, 0, 0);

// var canvasData = ctx.createImageData(canvas.width, canvas.height);
// drawShape(shiftCorners(circle.corners, tempX, tempY), canvasData, 255, 0, 0, 255);
// drawShape(shiftCorners(square.corners, fixedX, fixedY), canvasData, 255, 0, 0, 255);
// ctx.putImageData(canvasData, 0, 0);

// var circleData = ctx.createImageData(circleRadius, circleRadius);
// var squareData = ctx.createImageData(squareRadius, squareRadius);
// drawShape(circle.corners, circleData, 255, 0, 0, 255);
// drawShape(square.corners, squareData, 255, 0, 0, 255);
// ctx.putImageData(circleData, tempX, tempY);
// ctx.putImageData(squareData, fixedX, fixedY)

var up, down, left, right;
document.onkeydown = function(keyEvent)
{    
    if (keyEvent.which == 87)
    {
        up = true;
    }
    if (keyEvent.which == 65)
    {
        left = true;
    }
    if (keyEvent.which == 83)
    {
        down = true;
    }
    if (keyEvent.which == 68)
    {
        right = true;
    }
}
document.onkeyup = function(keyEvent)
{
    if (keyEvent.which == 87)
    {
        up = false;
    }
    if (keyEvent.which == 65)
    {
        left = false;
    }
    if (keyEvent.which == 83)
    {
        down = false;
    }
    if (keyEvent.which == 68)
    {
        right = false;
    }
}
var prevX = new Array();
var prevY = new Array();
var prevC = new Array();

function update()
{
    if (circle.collision({"xPosition": tempX, "yPosition": tempY}, {"xPosition": fixedX, "yPosition": fixedY}, square) == false)
    {
        if (up == true)
        {
            tempY = tempY - 1;
        }
        if (down == true)
        {
            tempY = tempY + 1;
        }
        if (left == true)
        {
            tempX = tempX - 1;
        }
        if (right == true)
        {
            tempX = tempX + 1;
        }
        prevC.push(false);
    }
    else
    {
        prevC.push(true);
        var index = prevC.length - 1;
        while (prevC[index] == true)
        {
            index = index - 1;
        }
        tempX = prevX[index]; // this is great because you have a history of all the places this object has been, which means you can draw on a minimap too
        tempY = prevY[index];
    }
}

var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    null;

var mainloop = function()
{
    prevX.push(tempX);
    prevY.push(tempY);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
    update();
    for (index = 0; index < canvasData.data.length; index = index + 1)
    {
        canvasData.data[index] = 0;
    }
    drawShape(shiftCorners(circle.corners, tempX, tempY), canvasData, 255, 0, 0, 255)
    drawShape(shiftCorners(square.corners, tempX, tempY), canvasData, 255, 0, 0, 255)
    ctx.putImageData(canvasData, 0, 0);
//    ctx.putImageData(circleData, tempX, tempY); // offset by 50 by 50 to move item by origin rather than by upper left corner
//    ctx.putImageData(squareData, fixedX, fixedY)
}

var recursiveAnimate = function()
{
    mainloop();
    animate(recursiveAnimate);
}
if (animate != null)
{
    animate(recursiveAnimate);
}
else
{
    setInterval(mainloop, 16);
}







// FOR LOCAL PLAYEROBJECT
function createPlayerObject(objectName, spriteLink, xOrigin, yOrigin, corners, acceleration, moveSpeed, turnSpeed)
{
    this.objectName = objectName;
    this.spriteLink = spriteLink;
    this.xOrigin = xOrigin;
    this.yOrigin = yOrigin;

    this.corners = corners;
    this.radius = 0;
    this.setRadius = function() // how to get function to run only once and put return value in variable?; update 06-25-13, simply call the function from within
    {
        var longestRadius = 0;
        for (index0 = 0; index0 < this.corners.length; index0 = index0 + 1)
        {
            if (longestRadius < distance(this.corners[index0].xPosition, this.corners[index0].yPosition))
            {
                longestRadius = distance(this.corners[index0].xPosition, this.corners[index0].yPosition);
            }
        }
        this.radius = longestRadius;
    }
    this.collision = function(networkObject1, networkObject2, localObject2) // localObject1 is this
    {
        var radiusThis = this.radius;
        var radiusThat = localObject2.radius;
        if (radiusThis + radiusThat < distance(networkObject2.xPosition - networkObject1.xPosition, networkObject2.yPosition - networkObject1.yPosition)) // checking if the objects are even close enough to consider collision
        {
            return false;
        }
        for (index1 = 0; index1 < localObject2.corners.length; index1 = index1 + 1)
        {
            for (index2 = 0; index2 < this.corners.length; index2 = index2 + 1)
            {
                if ((networkObject2.xPosition + localObject2.corners[index1].xPosition == networkObject1.xPosition + this.corners[index2].xPosition) && (networkObject2.yPosition + localObject2.corners[index1].yPosition == networkObject1.yPosition + this.corners[index2].yPosition)) // check if the corners of network objects are equal to each other
                {
                    return true;
                }
            }
        }
        return false;
    }

    this.acceleration = acceleration;
    this.moveSpeed = moveSpeed;
    this.turnSpeed = turnSpeed;

//  function calls
    this.setRadius();
}





// FOR LOCAL MAPOBJECT
function createMapObject(objectName, spriteLink, xOrigin, yOrigin, corners)
//////////////////////////////
//                          //
//  Inputs (Ordered)        //
//  objectName, spriteLink  //
//  xOrigin, yOrigin        //
//  corner                  //
//                          //
//////////////////////////////
{
    this.objectName = objectName;
    this.spriteLink = spriteLink; // reconsider changing this to the natural src extension, since this apparently goes well with it
    this.xOrigin = xOrigin;
    this.yOrigin = yOrigin;

    this.corners = corners;
    this.radius = 0;
    this.setRadius = function() // how to get function to run only once and put return value in variable?; update 06-25-13, simply call the function from within
    {
        var longestRadius = 0;
        for (index0 = 0; index0 < this.corners.length; index0 = index0 + 1)
        {
            if (longestRadius < distance(this.corners[index0].xPosition, this.corners[index0].yPosition))
            {
                longestRadius = distance(this.corners[index0].xPosition, this.corners[index0].yPosition);
            }
        }
        this.radius = longestRadius;
    }
    this.collision = function(networkObject1, networkObject2, localObject2) // localObject1 is this
    {
        var radiusThis = this.radius;
        var radiusThat = localObject2.radius;
        if (radiusThis + radiusThat < distance(networkObject2.xPosition - networkObject1.xPosition, networkObject2.yPosition - networkObject1.yPosition)) // checking if the objects are even close enough to consider collision
        {
            return false;
        }
        for (index1 = 0; index1 < localObject2.corners.length; index1 = index1 + 1)
        {
            for (index2 = 0; index2 < this.corners.length; index2 = index2 + 1)
            {
                if ((networkObject2.xPosition + localObject2.corners[index1].xPosition == networkObject1.xPosition + this.corners[index2].xPosition) && (networkObject2.yPosition + localObject2.corners[index1].yPosition == networkObject1.yPosition + this.corners[index2].yPosition)) // check if the corners of network objects are equal to each other
                {
                    return true;
                }
            }
        }
        return false;
    }
    this.cornerChange = function(operation, xPosition, yPosition)
    {
        if (operation == "add")
        {
            this.corners[this.corners.length] = {"xPosition": xPosition, "yPosition": yPosition}; // is the order of corners important? maybe if they are linked by a path... consider changing this later
        }
        if (operation == "delete")
        {
            for (index = 0; index < this.corners.length; index = index + 1)
            {
                if ((this.corners[index].xPosition == xPosition) && (this.corners[index].yPosition == yPosition))
                {
                    this.corners.splice(index, 1); // no break statement after this because there might be multiple instances of the same corner inside the array
                }
            }
        }
    }
    this.cornerExplode = function(gameData, playerName) // call this on moment of impact
    {
        // get angle of projectile
        // make circle arc from point, or oval with the long part pointing in angle of projectile
        // remove all appropriate corners
        var localProjectile;
        for (index = 0; index < gameData.localObject.projectileArray.length; index = index + 1) // search through local data for the radius
        {
            if (projectileObject.objectName == gameData.localObject.projectileArray[index].objectName)
            {
                localProjectile = gameData.localObject.projectileArray[index];
            }
        }
        var radius = localProjectile.explosiveRadius;
        var circle = localProjectile.impact;
        var intersection = new Array();
        var cornerAdjusted;
        for (index1 = 0; index1 < circle.length; index1 = index1 + 1)
        {
            cornerAdjusted = {"xPosition": projectileObject.xPosition + circle[index1].xPosition, "yPosition": projectileObject.yPosition + circle[index1].yPosition};
            for (index2 = 0; index2 < this.corners.length; index2 = index2 + 1)
            {
                if (cornerAdjusted == this.corners[index2])
                {
                    intersection.push(index2); // because of possible duplicate corners, we need to filter for an "unique" array
                }
            }
        }
        for (index = 0; index < this.corners.length; index = index + 1) // remove everything currently in the circle
        {
            if (distance(this.corners[index].yPosition - projectileObject.yPosition, this.corners[index].xPosition - projectileObject.xPosition) < radius)
            {
                this.corners.splice(index, 1);
            }
        }
        var intersectionAngle = Math.atan2((this.corners[intersection[1]].yPosition - this.corners[intersection[0].yPosition]), (this.corners[intersection[1].xPosition] - this.corners[intersection[0].xPosition]))
        if (intersectionAngle < 0)
        {
            intersectionAngle = intersectionAngle + (2 * Math.PI);
        }
        var projectileAngle = projectileObject.angle; // convert atan2 radians to degrees because easier
        if (projectileObject.angle < 0)
        {
            projectileAngle = projectileObject.angle + (2 * Math.PI);
        }
        if ((projectileAngle > intersectionAngle) && (projectileAngle > (intersectionAngle + Math.PI))) // filter circle to appropriate arc, also, this is assuming projectileObject.angle is in radians from -Math.PI to Math.PI
        {
            this.corners.splice(intersection[0], 1 + intersection[1] - intersection[0]);
        }
        else
        {
            this.corners.splice(0, intersection[0] + 1);
            this.corners.splice(intersection[1], this.corners.length);
        }

        for (index = 0; index < circle.length; index = index + 1) // add the arc to the corner array
        {
            cornerAdjusted = {"xPosition": projectileObject.xPosition + circle[index].xPosition, "yPosition": projectileObject.yPosition + cirlce[index].yPosition};
            this.cornerChange("add", cornerAdjusted.xPosition, cornerAdjusted.yPosition);
        }
    }

//  function calls
    this.setRadius();
}





// FOR LOCAL PROJECTILEOBJECT
function createProjectileObject(objectName, spriteLink, xOrigin, yOrigin, mass, corners, damage, velocity, deceleration, maxRange, explosiveRadius, explosiveTimer)
////////////////////////////////////////////////
//                                            //
//  Inputs (Ordered)                          //
//  objectName, spriteLink                    //
//  xOrigin, yOrigin, mass                    //
//  corners                                   //
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
    this.radius = 0;
    this.setRadius = function() // how to get function to run only once and put return value in variable?; update 06-25-13, simply call the function from within
    {
        var longestRadius = 0;
        for (index0 = 0; index0 < this.corners.length; index0 = index0 + 1)
        {
            if (longestRadius < distance(this.corners[index0].xPosition, this.corners[index0].yPosition))
            {
                longestRadius = distance(this.corners[index0].xPosition, this.corners[index0].yPosition);
            }
        }
        this.radius = longestRadius;
    }
    this.impact = new Array();
    this.setImpact = function()
    {
        this.impact = createCircle(this.explosiveRadius + 10); // explosiveRadius is the radius of playerObjects affected by the bullet on impact, whereas this.impact is the effect on the walls, hence the +10
    }
    this.collision = function(networkObject1, networkObject2, localObject2) // localObject1 is this
    {
        var radiusThis = this.radius;
        var radiusThat = localObject2.radius;
        if (radiusThis + radiusThat < distance(networkObject2.xPosition - networkObject1.xPosition, networkObject2.yPosition - networkObject1.yPosition)) // checking if the objects are even close enough to consider collision
        {
            return false;
        }
        for (index1 = 0; index1 < localObject2.corners.length; index1 = index1 + 1)
        {
            for (index2 = 0; index2 < this.corners.length; index2 = index2 + 1)
            {
                if ((networkObject2.xPosition + localObject2.corners[index1].xPosition == networkObject1.xPosition + this.corners[index2].xPosition) && (networkObject2.yPosition + localObject2.corners[index1].yPosition == networkObject1.yPosition + this.corners[index2].yPosition)) // check if the corners of network objects are equal to each other
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

//  function calls
    this.setRadius();
    this.setImpact();
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
    this.radius = 0;
    this.setRadius = function() // how to get function to run only once and put return value in variable?; update 06-25-13, simply call the function from within
    {
        var longestRadius = 0;
        for (index0 = 0; index0 < this.corners.length; index0 = index0 + 1)
        {
            if (longestRadius < distance(this.corners[index0].xPosition, this.corners[index0].yPosition))
            {
                longestRadius = distance(this.corners[index0].xPosition, this.corners[index0].yPosition);
            }
        }
        this.radius = longestRadius;
    }
    this.collision = function(networkObject1, networkObject2, localObject2) // localObject1 is this
    {
        var radiusThis = this.radius;
        var radiusThat = localObject2.radius;
        if (radiusThis + radiusThat < distance(networkObject2.xPosition - networkObject1.xPosition, networkObject2.yPosition - networkObject1.yPosition)) // checking if the objects are even close enough to consider collision
        {
            return false;
        }
        for (index1 = 0; index1 < localObject2.corners.length; index1 = index1 + 1)
        {
            for (index2 = 0; index2 < this.corners.length; index2 = index2 + 1)
            {
                if ((networkObject2.xPosition + localObject2.corners[index1].xPosition == networkObject1.xPosition + this.corners[index2].xPosition) && (networkObject2.yPosition + localObject2.corners[index1].yPosition == networkObject1.yPosition + this.corners[index2].yPosition)) // check if the corners of network objects are equal to each other
                {
                    return true;
                }
            }
        }
        return false;
    }

    this.magazineSize = magazineSize;
    this.magazineMax = magazineMax;

    this.firingRate = firingRate;
    this.firingModes = firingModes;
    this.fire = function(gameData, playerName) // where networkPlayerObject is an element of the array playerObject[] for network
    {
        var networkPlayerObject = getObject(gameData.networkObject.playerArray, "objectName", playerName);
        var projectileExist;
        for (index = 0; index < networkPlayerObject.projectile.length; index = index + 1) // if the projectiles already exist (their type has already been fired)
        {
            if (networkPlayerObject.projectile[index].objectName == this.projectile)
            {
                projectileExist = true;
                break;
            }
        }
        if (projectileExist != true) // if this is the first shot or another instance of the same type of projectile is not in existence yet
        {
            networkPlayerObject.projectile[networkPlayerObject.projectile.length] =
            {
                "objectName": this.projectile,
                "xPosition": new Array(),
                "yPosition": new Array(),
                "angle": new Array()
            };
        }
        for (index = 0; index < networkPlayerObject.projectile.length; index = index + 1)
        {
            if (networkPlayerObject.projectile[index].objectName == this.projectile)
            {
                var newPosition = projectileObject.angle.length;
                networkPlayerObject.projectile[index].xPosition[newPosition] = networkPlayerObject.xPosition + this.xOrigin;
                networkPlayerObject.projectile[index].yPosition[newPosition] = networkPlayerObject.yPosition + this.yOrigin;
                networkPlayerObject.projectile[index].angle[newPosition] = networkPlayerObject.angle + this.recoilFunction(gameData, playerName);
                break;
            }
        }
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

//  function calls
    this.setRadius();
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
        .playerArray[] // different player models
        .weaponArray[]
        .equipmentArray[]
        .projectileArray[]
        .mapArray[]
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
    
    .firingMode // current firing mode
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