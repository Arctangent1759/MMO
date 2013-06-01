var constants=require('./server_constants.js').constants;
var http = require('http');
var url = require('url');
var io = require('socket.io');
var mongo = require('mongodb');
var async = require('async');

function start(route,handle){

  //Collection of User Objects
  var userDb;

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
	  io.listen(server).on('connection',function(socket){

		var auth=false; //Keeps track of whether current user is logged on.
		var user; //Holds user data; defined iff auth is true.

		//Listen to client
		
		//Login
		socket.on('login',function(data){
		  if (!auth){ //Log in only if auth is true.
		  }else{
		  }
		});

		//Logout
		socket.on('logout',function(data){
		  auth=false; //Unauthenticate and wipe user.
		  user=undefined;
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
						socket.emit('createUserResult',{error:'Internal server error. Something broke. We\'re sorry.'});
					  }else{
						socket.emit('createUserResult',{error:false});
					  }
					});
				  }
				});
		 
			  }
			})
		  }
		});
	
		//Ingame Commands
		socket.on('command',function(data){
		  if (auth){ //Accept commands only if logged in
		  }else{
		  }
		});


		//Send data back to client for drawing
		
		/*
		setInterval(function(){
		  socket.emit('gameBoard',{'data goes':'here'});
		});
		*/


	  });
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

exports.start=start;
