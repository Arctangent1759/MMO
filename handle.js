fs=require('fs');
handle={

  //urls
  '/':function(response){renderText("html",response,'./assets/html/index.html');},

  //Special cases
  'file':function(response,ext,filename){
	if (ext=='html' || ext=='js' || ext=='css'){
	  renderText(ext,response,'./assets/'+ext+'/'+filename,undefined,handle['404']);
	}else if (ext=='jpg' || ext=='gif' || ext=='bmp' || ext=='png' || ext=='png' || ext=='ico'){
	  renderImage(ext,response,'./assets/img/' + filename,undefined,handle['404']);
	}else if (ext=='mp3' || ext=='ogg' || ext=='mp4'){
	  renderAudio(ext,response,'./assets/audio/'+filename,undefined,handle['404']);
	}else{
	  handle['404'](response);
	}
  },
  '404':function(response){renderError(response,'./assets/html/404.html',404);},
  '500':function(response){renderError(response,'./assets/html/500.html',500);},

};


//Helpas
function renderError(response,path,code){
  render("text/html",code,response,path);
}
function renderText(ext,response,path,success,failure){
  render("text/"+ext,200,response,path,success,failure);
}
function renderImage(ext,response,path,success,failure){
  render("image/"+ext,200,response,path,success,failure);
}
function renderAudio(ext,response,path,success,failure){
  //Pointless comment.
  render("audio/"+ext,200,response,path,success,failure);
}
function render(content, code, response,path,success,failure){
  if (typeof(success)=='undefined'){success=function(){}}
  if (typeof(failure)=='undefined'){failure=function(){}}
  fs.readFile(path,function(err,html){
	if (err){
	  failure(response,path);
	}else{
	  response.writeHeader(200, {"Content-Type": content});  
	  response.write(html);  
	  response.end();  
	  success(response,path);
	}
  })
}

exports.handle=handle;
