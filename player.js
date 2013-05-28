var Vector = require('./vector.js').Vector;
function Player(x,y,z,vx,vy,vz,ax,ay,az){
  this._position = new Vector(x,y,z);
  this._velocity = new Vector(vx,vy,vz);
  this._acceleration = new Vector(ax,ay,az);
}

Player.prototype.position=function(vec){
  if (typeof(vec)==object){
	this.position=vec;
  }else{
	return this.position;
  }
}

Player.prototype.velocity=function(vec){
  if (typeof(vec)==object){
	this.velocity=vec;
  }else{
	return this.velocity;
  }
}

Player.prototype.acceleration=function(vec){
  if (typeof(vec)==object){
	this.acceleration=vec;
  }else{
	return this.acceleration;
  }
}

exports.Player=Player;
