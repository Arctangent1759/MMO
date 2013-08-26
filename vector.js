function Vector(x,y,z){
  if (typeof(z)!='number'){
	z=0;
  }
  this._x=x;
  this._y=y;
  this._z=z;
  this.x=function(val){if (typeof(val)=="number"){this._x=val}else{return this._x;}}
  this.y=function(val){if (typeof(val)=="number"){this._y=val}else{return this._y;}}
  this.z=function(val){if (typeof(val)=="number"){this._y=val}else{return this._z;}}
  this.add=function(v){return new Vector(this._x+v._x,this._y+v._y,this._z+v._z);};
  this.scale=function(c){return new Vector(this._x*c,this._y*c,this._z*c);};
  this.subtract=function(v){return new Vector(this._x-v._x,this._y-v._y,this._z-v._z);};
  this.dotProd=function(v){return this._x*v._x + this._y*v._y + this._z*v._z;};
  this.crossProd=function(v){return new Vector(this._y*v._z-this._z*v._y,this._z*v._x-this._x*v._z,this._x*v._y-this._y*v._x);};
  this.norm=function(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z);};
  this.projection=function(v){
	var len=v.norm();
	if (len==0){
	  return 0;
	}
	return this.dotProd(v.scale(1/len));
  }
  this.getUnitVector=function(){
	return this.scale(1/this.norm());
  }
  this.getDistance=function(v){
	return Math.sqrt((this._x-v._x)*(this._x-v._x)+(this._y-v._y)*(this._y-v._y)+(this._z-v._z)*(this._z-v._z));
  }
}
exports.Vector=Vector;
