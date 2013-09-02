var constants=require('./server_constants.js').constants;

var Sessions=function(){
	this.__list={},
	this.__EmailToKey={},
	this.__size=0,
	this.insert=function(key,email,username,preferences,persistent,stats){
		if (this.has(key)){
			//Disallow key collisions
			return false;
		}
		if (this.__EmailToKey[email]){
			return this.__EmailToKey[email];
		}
		this.__list[key]={
			last_accessed:new Date(),
			email:email,
			username:username,
			preferences:preferences,
			command:{
				keyboard:{
				},
				mouse:{
					click:false,
					position:[0,0],
				},
				upgrade:"",
			},
			playerObj:{  
				username:username,
				max_health:false,
				max_exp:false,
				exp:false,
				level:false,
				stats:false,
				health:false,
				x:false,
				y:false,
				bullets:[],
			},
			gameState:false,
			persistent:persistent,
			sessionKey:key,
			stats:stats,
		};
		this.__EmailToKey[email]=key;
		this.__size++;
		return key;
	},
	this.remove=function(key){
		if (!this.has(key)){
			return false;
		}
		this.__size--;
		//Commmit data to database
		this.__db.update({'email':this.__EmailToKey[key]},{$set:{
			stats:this.__list[key].stats,
		}},{upsert: false,multi: false,w: 0});
		delete this.__EmailToKey[this.__list[key].email];
		delete this.__list[key];
		return true;
	},

	this.has=function(key){
		return this.__list.hasOwnProperty(key);
	},
	this.get=function(key){
		if (!this.has(key)){
			return false;
		}
		this.__list[key].last_accessed=new Date();
		return this.__list[key];
	},
	this.purge=function(){
		for (var i in this.__list){
			if (!this.__list[i].persistent && new Date()-this.__list[i].last_accessed>constants.session_timeout){
				//Kill session if it's not marked as persistent and last_accessed is older than session_timeout.
				this.__list[i].gameState.commit();
				this.remove(i);
			}
		}
	},
	this.size=function(){
		return __size;
	},
	this.each=function(callback){
		//Callback is in the form function(key,value)
		for (var i in this.__list){
			callback(i,this.__list[i]);
		}
	}
	this.__db=false;
}
exports.Sessions=Sessions;
