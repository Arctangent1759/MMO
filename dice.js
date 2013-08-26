function d(n,N){
  var total = 0;
  for (var i=0; i < n; i++){
	total+=Math.ceil(N*Math.random());
  }
  return total;
}
function statRoll(n,N){
  var total=0;
  var min = false;
  for (var i = 0; i < n; i++){
	var curr = Math.ceil(N*Math.random()); 
	total+=curr;
	if (!min || curr < min){
	  min=curr;
	}
  }
  total-=min;
  return total;
}
exports.dice={'d':d,'statRoll':statRoll};
