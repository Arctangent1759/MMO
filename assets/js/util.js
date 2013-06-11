//Gets querystring split into key value pairs
function processQueryString(){
  var out={};
  var q=document.location.search.slice(1).split("&");
  var kv,key,value;
  for (var i = 0; i < q.length; i++){
	kv=q[i].split("=");
	key=kv[0];
	value=kv[1];
	out[key]=value;
  }
  return out;
}
