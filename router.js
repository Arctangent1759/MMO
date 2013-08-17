function route(handle,pathname,response){
  var ext=pathname.substr(pathname.lastIndexOf('.') + 1);
  if (ext!=pathname){
	handle['file'](response,ext,pathname)
  }else if (typeof(handle[pathname])=='function'){
	handle[pathname](response);
  }else{
	handle['404'](response);
  }
}
exports.route=route;

/* 
 *
 * So I put the following somewhere in my cs61c hw2:
 * "Create container for string copy. Add one to 
 * account for the 'Null Terminator'. Which, along 
 * with 'Running Time' and 'Django (the web framework) 
 * Unchained', make for great CS-related movie titles.
 *
 */
