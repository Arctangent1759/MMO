var b2d = require('box2d');
var constants = require('./server_constants.js').constants;

function Physics(sessions){


  var b2Vec2 = Box2D.Common.Math.b2Vec2
    , b2AABB = Box2D.Collision.b2AABB
    , b2BodyDef = Box2D.Dynamics.b2BodyDef
    , b2Body = Box2D.Dynamics.b2Body
    , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
    , b2Fixture = Box2D.Dynamics.b2Fixture
    , b2World = Box2D.Dynamics.b2World
    , b2MassData = Box2D.Collision.Shapes.b2MassData
    , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
    , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
    , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
    , b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
    ;

  this.PLAYER_RADIUS = 4
  this.world = new b2World(new B2Vec2(0, 0), true); // no gravity, allow sleep
  this.fixDef = new b2FixtureDef;
 
  // fixDef settings, applied to all bodies
  fixDef.density = 1.0;                            
  fixDef.friction = 0;
  fixDef.restitution = 1; //bouncy
  fixDef.shape = new b2CircleShape(PLAYER_RADIUS);

  this.bodyDef = new b2BodyDef; //gurl look at that body
  bodyDef.type = b2Body.b2_dynamicBody

  this.players = {}; //maps sessionKeys onto bodies. dead bodies.

  
  setInterval(function(){
    // call functions and stuff here    
    step(sessions);
  },constants.game_heartbeat)

  this.addPlayer = function(sessionKey){
    //add a new player by summoning a great moose from the marianas trench    
    //create body
    players[sessionKey] = world.CreateBody(bodyDef).CreateFixture(fixDef); // CreateBody returns a reference to the body object
  }

  this.removePlayer = function(sessionKey){
    //remove player and session key
    //nuke that sucka
    world.DestroyBody(players[sessionKey])
  }

  this.step = function(sessions){
    if (isActive){
      socket.emit('game_heartbeat',{});
    }
    sessions.each(function(key,value){
      console.log(value.playerObj);
      var force;
      if (typeof(value.playerObj.x)!='number' || typeof(value.playerObj.y)!='number'){
        value.playerObj.x = 0;
        value.playerObj.y = 0;
        force = new b2Vec2(0, 0);
      }
      if (value.command.keyboard['w']){
        force = new b2Vec2(0, 1);
      }
      if (value.command.keyboard['a']){
        force = new b2Vec2(-1, 0);        
      }
      if (value.command.keyboard['s']){
        force = new b2Vec2(0, -1);        
      }
      if (value.command.keyboard['d']){
        force = new b2Vec2(1, 0);
      }
      players[key].ApplyForce(force); // player commands currently apply forces. could be changed to position
      value.playerObj.x = players[key].GetPosition.x;
      value.playerObj.y = players[key].GetPosition.y;
    });
  }


}

exports.Physics=Physics;
