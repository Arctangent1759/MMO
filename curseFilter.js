function CurseFilter(wordList,delimiters,swapChars){
  if (!wordList){
	wordList = ['yolo', 'swag', 'yoloswag', 'beiber', 'cs70', 'republican', 'chuey','chuster', 'chuish', 'facepalm'];
  }

  if (!delimiters){
	delimiters=['.',',','(',')',';',':',' ','/','\\','"','\'','[',']','{','}','-','+','=','_'];
  }

  if (!swapChars){
	swapChars=['!','@','#','$','%','^','&','*'];
  }

  this.__tree = new Tree('ROOT');
  this.__delimiters=delimiters;
  this.__swapChars=swapChars;

  var cursor=this.__tree;
  var words = [];
  for (var i = 0; i < wordList.length; i++){
	words.push(wordList[i].toLowerCase());
  }
  for (var i = 0; i < words.length; i++){
	cursor=this.__tree;
	for (var j = 0; j < words[i].length; j++){
	  if (!cursor.hasChild(words[i][j])){
		cursor.addChild(words[i][j]);
	  }
	  cursor=cursor.getChild(words[i][j]);
	}
	cursor.addChild('END');
  }

  this.checkWord=function(word){
	word=word.toLowerCase();
	var cursor=this.__tree;
	for (var i = 0; i < word.length; i++){
	  cursor=cursor.getChild(word[i]);
	  if (!cursor){
		return false;
	  }
	}
	return cursor.hasChild('END')
  }

  this.filterPhrase=function(phrase){
	var copy=phrase;
	var curseWords=[];
	var wordsRaw;
	for (var i = 0; i < this.__delimiters.length; i++){
	  copy = copy.split(this.__delimiters[i]).join(" ");
	}
	wordsRaw=copy.split(" ");
	for (var i = 0; i < wordsRaw.length; i++){
	  if (this.checkWord(wordsRaw[i])){
		curseWords.push(wordsRaw[i]);
	  }
	}
	for (var i = 0; i < curseWords.length; i++){
	  phrase=phrase.replace(curseWords[i],this.__generateBleepWord(curseWords[i].length));
	}
	return phrase;
  }

  this.__generateBleepWord=function(wordLength){
	var out = "";
	for (var i = 0; i < wordLength; i++){
	  out += this.__swapChars[Math.floor(Math.random()*this.__swapChars.length)];
	}
	return out;
  }
}

function Tree(value){
  this.__value=value;
  this.__children={};
  this.value=function(val){
	if (val){
	  this.__value=val;
	}else{
	  return this.__value;
	}
  }
  this.hasChild=function(child){
	return this.__children.hasOwnProperty(child);
  }
  this.addChild=function(val){
	this.__children[val]=new Tree(val);
  }
  this.getChild=function(val){
	if (!this.hasChild(val)){
	  return false;
	}
	return this.__children[val];
  }
}

exports.CurseFilter=CurseFilter;

/**
 *
 * “Some lurid things have been 
 * said about me—that I am a 
 * racist, a hopeless alcoholic, 
 * a closet homosexual and so 
 * forth—that I leave to others 
 * to decide the truth of. I'd 
 * only point out, though, that 
 * if true these accusations 
 * must also have been true 
 * when I was still on the correct 
 * side, and that such shocking 
 * deformities didn't seem to 
 * count for so much then. 
 * Arguing with the Stalinist 
 * mentality for more than three d
 * ecades now, and doing a bit of 
 * soapboxing and street-corner 
 * speaking on and off, has meant 
 * that it takes quite a lot to 
 * hurt my tender feelings, or 
 * bruise my milk-white skin.” 
 *
 *                   --Christopher Hitchens
 *
 */
