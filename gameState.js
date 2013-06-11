function gameState(){
  this.__players=[];
  this.__emailToPlayer={};
  this.__usernameToPlayer={};
  this.__sessionKeyToPlayer={};
}
function player(email,username,sessionKey){
  this.email=email;
  this.username=username;
  this.sessionKey=sessionKey
}
