var Vector = require('./vector.js').Vector;

function Bullet(x,y,vx,vy){
  this._position = new Vector(x,y);
  this._velocity = new Vector(vx,vy);
}

Bullet.prototype.position=function(vec){
  if (typeof(vec)=='object'){
	if (!(isNaN(vec.x()) || isNaN(vec.y()) || isNaN(vec.z()))){
	  this._position=vec;
	}
  }else{
	return this._position;
  }
}

Bullet.prototype.velocity=function(vec){
  if (typeof(vec)=='object'){
	if (!(isNaN(vec.x()) || isNaN(vec.y()) || isNaN(vec.z()))){
	  this._velocity=vec;
	}
  }else{
	return this._velocity;
  }
}

Bullet.prototype.update=function(){
  this.position(this.position().add(this.velocity()));
}

exports.Bullet=Bullet;
