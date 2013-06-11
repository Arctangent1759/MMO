var b2d = require('box2d');
function gameLoop(sessions){
  // Define world
  var worldAABB = new b2d.b2AABB();
  worldAABB.lowerBound.Set(-100.0, -100.0);
  worldAABB.upperBound.Set(100.0, 100.0);

  var gravity = new b2d.b2Vec2(0.0, 0.0);
  var doSleep = true;

  var world = new b2d.b2World(worldAABB, gravity, doSleep);

  // Dynamic Body
  var bodyDef = new b2d.b2BodyDef();
  bodyDef.position.Set(0.0, 4.0);

  var body = world.CreateBody(bodyDef);

  var shapeDef = new b2d.b2PolygonDef();
  shapeDef.SetAsBox(1.0, 1.0);
  shapeDef.density = 1.0;
  shapeDef.friction = 0.3;
  body.CreateShape(shapeDef);
  body.SetMassFromShapes();

  // Run Simulation!
  var timeStep = 1.0 / 60.0;

  var iterations = 10;

  sessions.each(function(item){
     // TODO: update locations/velocities of all bodies  
     // create reference to new position
     
  });
  // pass body list to clientside for drawing

}


exports.gameLoop=gameLoop;
