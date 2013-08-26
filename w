var constants = require('./server_constants.js').constants;
var Player = require('./player.js').Player;
var Vector = require('./vector.js').Vector;

function Physics(sessions){
  this.sessions=sessions;

  this.addPlayer = function(sessionKey){
	var player = this.sessions.get(sessionKey);
	if (player.gameState){
	  console.log("Attempted to create same player twice.");
	  return;
	}else{
	  player.gameState=new Player(0,0,0,1,0,0,player.stats); //TODO: Initialize at spawnpoint. This will not be done for a very long time.
	}
  }

  this.removePlayer = function(sessionKey){
	var player = this.sessions.get(sessionKey);
	player.gameState.commit();
	player.gameState=false;
  }

  this.step = function(sessions){
	var sessions=this.sessions
	  sessions.each(function(key,value){
		if (typeof(value.playerObj.x)!='number' || typeof(value.playerObj.y)!='number'){
		  value.playerObj.x = 0;
		  value.playerObj.y = 0;
		}

		//Take player input.

		var accelIn = new Vector(0,0);

		if (value.command.keyboard['w']){
		  //Go Right
		  accelIn = accelIn.add(new Vector(0,1));
		}
		if (value.command.keyboard['a']){
		  //Go Left
		  accelIn = accelIn.add(new Vector(-1,0));
		}
		if (value.command.keyboard['s']){
		  //Go Up
		  accelIn = accelIn.add(new Vector(0,-1));
		}
		if (value.command.keyboard['d']){
		  //Go Down
		  accelIn = accelIn.add(new Vector(1,0));
		}
		if (value.command.mouse.click){
		  //Shoot
		  value.gameState.spawnBullet((new Vector(value.command.mouse.position[0],value.command.mouse.position[1])).getUnitVector());
		}

		if (accelIn.norm()!=0){
		  //Normalize.
		  accelIn=accelIn.getUnitVector().scale(constants.player_acceleration+computeBonus(value.gameState.dexterity));
		}

		if (value.gameState.velocity().norm()!=0){
		  //Drag
		  accelIn=accelIn.subtract(value.gameState.velocity().scale(constants.friction));
		}

		//Collision
		sessions.each(function(colKey,colValue){
		  if (colKey!=key){
			//Player Collision
			if (value.gameState.position().getDistance(colValue.gameState.position())<2*constants.collision_radius){
			  var betweenVec = colValue.gameState.position().subtract(
				value.gameState.position()
				).getUnitVector();

			  var resolutionVecVal = betweenVec.scale(
				value.gameState.velocity().dotProd(
				  betweenVec
				  )
				);
			  var resolutionVecCol = betweenVec.scale(-1).scale(
				colValue.gameState.velocity().dotProd(
				  betweenVec.scale(-1)
				  )
				);
			  value.gameState.velocity(value.gameState.velocity().add(resolutionVecCol.subtract(resolutionVecVal)));
			  colValue.gameState.velocity(value.gameState.velocity().add(resolutionVecVal.subtract(resolutionVecCol)));
			}
			//meow
			//Bullet collision
			for (var i = 0; i < colValue.gameState.bullets.length; i++){
			  if (colValue.gameState.bullets[i].position().getDistance(value.gameState.position()) < constants.collision_radius){
				//Collision logic
				var v_parallel = value.gameState.velocity().getUnitVector().scale(
				  value.gameState.velocity().dotProd(
					colValue.gameState.bullets[i].velocity().getUnitVector()
				  )
				);
				var v_final = v_parallel.scale(constants.player_mass).add(colValue.gameState.bullets[i].velocity().scale(constants.bullet_mass)).scale(1/(constants.player_mass+constants.bullet_mass));
				value.gameState.velocity(value.gameState.velocity().add(v_final.subtract(v_parallel)));
				colValue.gameState.bullets.splice(i,1);
			  }
			}
		  }
		});


		value.gameState.acceleration(accelIn);
		value.gameState.update();

		value.gameState.inform(value.playerObj);

	  });
  }


}

exports.Physics=Physics;
