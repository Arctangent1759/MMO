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
