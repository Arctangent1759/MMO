function computeBonus(stat){
  return Math.floor((stat-10)/2)
}
exports.computeBonus=computeBonus;
function computeExp(stats){
  return 10*Math.ceil(stats.level/5);
}
exports.computeExp=computeExp;
function computeExpCap(level){
  var out = 10
  for (var i = 1; i < level; i++){
	out*=2;
  }
  return out;
}
exports.computeExpCap=computeExpCap;
