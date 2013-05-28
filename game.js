var b2d = require('box2d');

var worldAABB = new b2d.b2AABB();

var gravity = new b2d.b2Vec2(0.0, 0.0);

var doSleep = true;

var world = new b2d.b2World(worldAABB, gravity, doSleep);


function gameLoop(){
  setInterval(function(){
  },15);
}


exports.gameLoop=gameLoop;
