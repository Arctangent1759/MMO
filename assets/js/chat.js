//  Note:
//  This code will crash and burn, unless the name 'socket' is already defined in the namespace.

function sendChat(message,channel){
  var msg={
	sessionKey:sessionKey,
	channel:channel,
	message:message,
  };
  socket.emit('chat',msg);
}

function chatTest(data){
  //TODO: Actually do stuff with UI.
  console.log('@'+data.timestamp+'  ---  '+data.sender+' >> '+data.channel+': ' + data.message);
}

function setupChat(onChat){
  socket.on('chat',onChat);
}
