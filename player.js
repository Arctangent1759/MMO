var Vector = require('./vector.js').Vector;
var Bullet = require('./bullet.js').Bullet;
var constants = require('./server_constants.js').constants;
var computeBonus = require('./util.js').computeBonus;
var computeExpCap = require('./util.js').computeExpCap;

function Player(x,y,vx,vy,ax,ay,stats){

	this._position = new Vector(x,y);
	this._velocity = new Vector(vx,vy);
	this._acceleration = new Vector(ax,ay);
	this.bullets=[];
	this.fireCounter=0;
	this.flags={
		'shot':false,
		'hit':false,
		'levelUp':false,
	};

	//Init temp_Stats
	this.max_health=constants.player_base_health+computeBonus(stats.constitution)*10;
	this.health=this.max_health;
	this.stats=stats;

}

Player.prototype.position=function(vec){
	if (typeof(vec)=='object'){
		if (!(isNaN(vec.x()) || isNaN(vec.y()) || isNaN(vec.z()))){
			this._position=vec;
		}
	}else{
		return this._position;
	}
}

Player.prototype.velocity=function(vec){
	if (typeof(vec)=='object'){
		if (!(isNaN(vec.x()) || isNaN(vec.y()) || isNaN(vec.z()))){
			this._velocity=vec;
		}
	}else{
		return this._velocity;
	}
}

Player.prototype.acceleration=function(vec){
	if (typeof(vec)=='object'){
		if (!(isNaN(vec.x()) || isNaN(vec.y()) || isNaN(vec.z()))){
			this._acceleration=vec;
		}
	}else{
		return this._acceleration;
	}
}

Player.prototype.spawnBullet=function(v){
	if (this.fireCounter <= 0){
		var b = new Bullet(this.position().x(),this.position().y(),constants.bullet_speed*v.x()+this.velocity().x(),constants.bullet_speed*v.y()+this.velocity().y());
		this.bullets.push(b);
		this.flags.shot=true;

		//Update momentum
		var v_parallel = this.velocity().getUnitVector().scale(
				this.velocity().dotProd(
					b.velocity().getUnitVector()
					)
				);

		var v_final = v_parallel.scale(
				(constants.player_mass+computeBonus(this.stats.constitution)+constants.bullet_mass)/(constants.player_mass+computeBonus(this.stats.constitution))
				).subtract(b.velocity().scale(
						(constants.bullet_mass)/(constants.player_mass+computeBonus(this.stats.constitution))
						));

		this.velocity(this.velocity().add(v_final.subtract(v_parallel)));

		this.fireCounter=10*constants.gameRefresh/(constants.fire_rate+computeBonus(this.stats.intelligence)/4);
	}
}

Player.prototype.update=function(){
	this.velocity(this.velocity().add(this.acceleration()));
	this.position(this.position().add(this.velocity()));
	for (var i = 0; i < this.bullets.length; i++){
		this.bullets[i].update();
	}
	if (this.bullets.length>constants.max_bullets){
		this.bullets.shift();
	}
	if (this.fireCounter>0){
		this.fireCounter--;
	}
}

Player.prototype.commit=function(){
	//TODO: Update Sessions for database update here.
	//Deprecated
}

Player.prototype.inform=function(p){
	p.x=this.position().x();
	p.y=this.position().y();
	if (this.velocity().norm()>constants.turn_velocity_threshold){
		p.angle=Math.atan2(this.velocity().y(),this.velocity().x());
	}
	p.bullets=this.bullets;
	p.max_health=this.max_health;
	p.health=this.health;
	p.max_exp=computeExpCap(this.stats.level);
	p.exp=this.stats.experience;
	p.level=this.stats.level;
	p.stats=this.stats;
	p.flags=this.flags;
}

exports.Player=Player;
