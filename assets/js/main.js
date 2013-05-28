//Constants
var CONTAINER_ID="game";
var CANVAS_ID="canvas";
var padding=50;
$(document).ready(function(){
  init();
  setInterval(run,16);
  paint();
});

function init(){
  //Create game canvas
  $("#"+CONTAINER_ID).html("<div width='100%'height='"+padding+"'>&nbsp</div><canvas id="+CANVAS_ID+" class=game_container width=200 height=200></canvas>");
  var cvs=document.getElementById(CANVAS_ID);

  //Style canvas
  window.onresize=function(){cvs.height=window.innerHeight-padding;cvs.width=window.innerWidth-padding;};
  window.onresize();

  //Load resources
}

function run(){
}

function paint(){
  window.requestAnimationFrame(paint);
}
