var constants=require('./server_constants.js').constants;
var http = require('http');
var url = require('url');
var io = require('socket.io');
var mongo = require('mongodb');
var async = require('async');

function start(route,handle){

  //Collection of User Objects
  var userDb;

  //All session keys and associated clientside data. Kids, don't make your data structures this way.
  var sessions={
	__list:{},
	__EmailToKey:{},
	__size:0,
	insert:function(key,email,username,persistent){
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
		persistent:persistent,
	  };
	  this.__EmailToKey[email]=key;
	  this.__size++;
	  return key;
	},
	remove:function(key){
	  if (!this.has(key)){
		return false;
	  }
	  this.__size--;
	  this.__EmailToKey.remove(__list[key].email);
	  __list.remove(key);
	  return true;
	},
	has:function(key){
	  return this.hasOwnProperty(key);
	},
	get:function(key){
	  if (!this.has(key)){
		return false;
	  }
	  __list[key].last_accessed=new Date();
	  return __list[key];
	},
	purge:function(){
	  for (var i in this.__list){
	    if (!this.__list[i].persistent && new Date()-this.__list[i].last_accessed>constants.session_timeout){
		  //Kill session if it's not marked as persistent and last_accessed is older than session_timeout.
		  this.remove(i);
		}
	  }
	},
	size:function(){
	  return __size;
	},
  };

  async.series([

	function printStarting(next){
	  console.log("Server starting...");
	  next();
	},

	function connectDb(next){
	  console.log('\tConnecting database...')
	  var dbServer = new mongo.Server(constants.hostname,constants.db_port,{auto_reconnect: true});
	  var db = new mongo.Db('GameData',dbServer,{w:1});
	  //Pointless comment
	  db.open(function(err,db){
		if (!err){
		  db.collection('Users',function(err, collection){
			if (!err){
			  userDb=collection;
			  console.log('\tDatabase successfully connected.');
			  next();
			}else{console.log(err);}
		  })
		}else{console.log(err);}
	  });
	},

	function startHTTP(next){
	  console.log("\tStarting http...")
	  var server = http.createServer(function(request,response){
		var pathname = url.parse(request.url).pathname;
		route(handle,pathname,response);
	  }).listen(constants.port,function(){
		console.log("\thttp started.")
		next();
	  });
	  io.listen(server, {log:false}).on('connection',function(socket){

		//Listen to client
		
		//Login
		socket.on('login',function(data){
		  console.log('Login recieved.');
		  userDb.findOne({email:data.email},function(err,item){
			console.log('Database query successful.');
			if (item && pwHash(data.password)==item.password){
			  //Successful Login
			  socket.emit('loginResult',{sessionId:genSessionKey(sessions,item,data.persistent), username:item.username})
			  console.log("logged on!");
			}else{
			  //Failed Login
			  socket.emit('loginResult',{sessionId:false, error:'Incorrect password.'});
			  console.log("Failed log on!");
			}
		  });
		});

		//Logout
		socket.on('logout',function(data){
		});

		//NewUser
		socket.on('newUser',function(data){
		  console.log("newUser recieved");
		  console.log("Data",data);
		  if (!validateEmail(data.email)){
			//Invalid email
			socket.emit('createUserResult',{error:'Email  is invalid.'})
		  } else if (data.password!=data.password_confirmation){
			//Invalid password
			socket.emit('createUserResult',{error:'Passwords do not match.'})
		  }else{
			userDb.findOne({email:data.email},function(err,item){
			  if (item){
				//Email already in database
				socket.emit('createUserResult',{error:'Email already in use.'})
			  }else{
				userDb.findOne({username:data.username},function(err,item){
				  if (item){
					//Username already in database
					socket.emit('createUserResult',{error:'Username already in use.'})
				  }else{
					//Create the user.
					userDb.insert({
					  email:data.email,
					  username:data.username,
					  password:pwHash(data.password)
					},{safe:true},function(err,result){
					  if (err){
						socket.emit('createUserResult',{error:'Internal server error. Something broke. We\'re sorry.'});  //TURING LIVES!
					  }else{
						socket.emit('createUserResult',{error:false,successMessage:'Your account has been created. An account confirmation email has been sent to ' + data.email+'.'});
					  }
					});
				  }
				});
		 
			  }
			});
		  }
		});
	
		//Ingame Commands
		socket.on('command',function(data){
		});


		//Send data back to client for drawing
		
		/*
		setInterval(function(){
		  socket.emit('gameBoard',{'data goes':'here'});
		});
		*/


	  });
	},
	function startPurgeProcess(next){
	  setInterval(sessions.purge,60000);
	  next();
	},
	function finish(){
	  console.log("Server started.");
	  console.log("Listening at http://localhost:1759");
	  console.log("Press Ctrl-c to stop.");
	}
  ])
}

//Helper functions

function validateEmail(email) { 
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
} 

function pwHash(pw){
  //Goes "Hashy hashy."
  var hash=0;
  for (var i = 0; i < pw.length; i++){
	hash+=pw.charCodeAt(i)*Math.pow(0x10,i)%70368760954879;
  }
  return hash;
}

function genSessionKey(sessions,item,persistent){
  var key;
  do{
	//Randomize crap! It's 3:20AM! feel free to make this work better.
	key=sessions.insert(((Math.random()*pwHash(item.username))+Number(new Date()))%70368760954879,item.email,item.username,persistent)
  }while(!key);
  return key;
}

exports.start=start;
