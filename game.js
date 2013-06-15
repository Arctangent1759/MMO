var b2d = require('box2d');
var constants = require('/server_constants.js').constants;

function physics(sessions){

  setInterval(function(){
    // call functions and stuff here    
    step(sessions);
  },constants.game_heartbeat)

  this.addPlayer = function(sessionKey){
    //add a new player by summoning a great moose from the marianas trench    
    //create bodydef
  }

  this.removePlayer = function(sessionKey(){
    //remove player and session key
    //nuke that sucka
  }

  this.step = function(sessions){
    if (isActive){
      socket.emit('game_heartbeat',{});
    }
    sessions.each(function(key,value){
      console.log(value.playerObj);
      if (typeof(value.playerObj.x)!='number' || typeof(value.playerObj.y)!='number'){
        value.playerObj.x=0;
        value.playerObj.y=0;
      }
      if (value.command.keyboard['w']){
        value.playerObj.y+=1;
      }
      if (value.command.keyboard['a']){
        value.playerObj.x-=1;
      }
      if (value.command.keyboard['s']){
        value.playerObj.y-=1;
      }
      if (value.command.keyboard['d']){
        value.playerObj.x+=1;
      }
    });
  }


}

exports.physics=physics;
