var constants = require('./server_constants.js').constants;
var Player = require('./player.js').Player;
var Vector = require('./vector.js').Vector;
var computeBonus = require('./util.js').computeBonus;
var computeExp = require('./util.js').computeExp;
var computeExpCap = require('./util.js').computeExpCap;
var dice = require('./dice.js').dice;

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
	var sessions=this.sessions;
	var physObj = this;
	sessions.each(function(key,value){
		for (var i in value.gameState.flags){
			//Unset all state flags.
			value.gameState.flags[i]=false;
		}
	});
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

	  if (value.command.upgrade!=""){
		switch (value.command.upgrade){
		  case "STR":
			value.stats.strength++;
			value.stats.skillPoints--;
			break;
		  case "DEX":
			value.stats.dexterity++;
			value.stats.skillPoints--;
			break;
		  case "CON":
			value.stats.constitution++;
			value.stats.skillPoints--;
			break;
		  case "INT":
			value.stats.intelligence++;
			value.stats.skillPoints--;
			break;
		  case "WIS":
			value.stats.wisdom++;
			value.stats.skillPoints--;
			break;
		  case "CHA":
			value.stats.charisma++;
			value.stats.skillPoints--;
			break;
		  default:
		}
		value.command.upgrade="";
	  }

	  if (accelIn.norm()!=0){
		//Normalize.
		accelIn=accelIn.getUnitVector().scale(constants.player_acceleration+computeBonus(value.stats.dexterity)/100);
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

			var val_v_parallel = betweenVec.scale(
			  value.gameState.velocity().dotProd(
				betweenVec
				)
			  );
			var col_v_parallel = betweenVec.scale(-1).scale(
			  colValue.gameState.velocity().dotProd(
				betweenVec.scale(-1)
				)
			  );

			var val_v_final=val_v_parallel.scale(computeBonus(value.stats.constitution)-computeBonus(colValue.stats.constitution)).add(
			  col_v_parallel.scale(2*(constants.player_mass+computeBonus(colValue.stats.constitution)))
			  ).scale(1/(2*constants.player_mass+computeBonus(value.stats.constitution)+computeBonus(colValue.stats.constitution)));

			var col_v_final=col_v_parallel.scale(computeBonus(colValue.stats.constitution)-computeBonus(value.stats.constitution)).add(
				val_v_parallel.scale(2*(constants.player_mass+computeBonus(value.stats.constitution)))
				).scale(1/(2*constants.player_mass+computeBonus(value.stats.constitution)+computeBonus(colValue.stats.constitution)));

			value.gameState.velocity(value.gameState.velocity().add(val_v_final.subtract(val_v_parallel)));
			colValue.gameState.velocity(value.gameState.velocity().add(col_v_final.subtract(col_v_parallel)));


			//Engulfment edge case
			value.gameState.position(
				value.gameState.position().add(
				  betweenVec.scale(
					constants.collision_radius+constants.collision_buffer-value.gameState.position().subtract(colValue.gameState.position()).norm()
					)
				  )
				);
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
			  var v_final = v_parallel.scale(constants.player_mass+computeBonus(value.stats.constitution)).add(colValue.gameState.bullets[i].velocity().scale(constants.bullet_mass)).scale(1/(constants.player_mass+computeBonus(value.stats.constitution)+constants.bullet_mass));
			  value.gameState.velocity(value.gameState.velocity().add(v_final.subtract(v_parallel)));
			  colValue.gameState.bullets.splice(i,1);

			  value.gameState.health-=constants.bullet_base_damage+dice.d(constants.bullet_base_dice_num,constants.bullet_base_dice)+computeBonus(colValue.stats.strength);
			  value.gameState.flags.hit=true;
			  if (value.gameState.health<=0){
				//Increment XP
				colValue.stats.experience+=computeExp(value.stats);
				if (colValue.stats.experience >= computeExpCap(colValue.stats.level)){
				  colValue.stats.level++;
				  colValue.stats.skillPoints+=constants.skillPointsPerLevel;
				  //Level up logic
				  colValue.stats.experience=0;
				  colValue.flags.levelUp=true;
				}
				//For dead players
				physObj.removePlayer(key);
				physObj.addPlayer(key);
			  }
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
