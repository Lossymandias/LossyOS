import {EX_winR, EX_winM} from "./losOS/winClass.js"
import {gAttrDefaultWin,gScale,setSizeCanvas} from "./losOS/gAttr.js"

function __init__() {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = Math.floor(window.innerWidth * gScale);
  canvas.height = Math.floor(window.innerHeight * gScale);
  
  setSizeCanvas([canvas.width,canvas.height]);
  ctx.imageSmoothingEnabled = false;
        
  //document.getElementsByTagName("body")[0].style.background = "#FFFF"
  document.getElementsByTagName("body")[0].style.cursor = "url('data:image/x-icon;base64,AAACAAEAICACAAAAAAAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAgAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAABIAAAISAAADJAAAAqQAAAJIAAACD4AAAgEAAAICAAACBAAAAggAAAIQAAACIAAAAkAAAAKAAAADAAAAA//////////////////////////////////////////////////////////////////////////////////////x////4f///eH///zD///8Q////Af///wAf//8AP///AH///wD///8B////A////wf///8P////H////z////8='), auto";

  canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    iMouseP = [mousePos.x*gScale,mousePos.y*gScale];
  }, false);

  window.addEventListener("mousedown", (event) => {
    if (event.button === 0) iMouseState[0] = true;

  });

  window.addEventListener("mouseup", (event) => {
    if (event.button === 0) iMouseState[0] = false;
  });

  return [ctx,canvas];
}

let iMouseP = [0,0]; 
let iMouseState = [false,false];

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

let iMousePrevState = false;
function __loop__(){
    requestAnimationFrame(__loop__);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //ctx.fillStyle = "WHITE";
    //ctx.fillRect(0,0,canvas.width,canvas.height);
    
    winM.draw(ctx);
    const clickChanged = iMousePrevState !== iMouseState[0];
    winM.grabContext(iMouseP,iMouseState, clickChanged);

    iMousePrevState = iMouseState[0];
    
}

const [ctx, canvas] = __init__();
const winM = new EX_winM();
gAttrDefaultWin.forEach((x,idx) => winM.addWin(new EX_winR(x.sstrdId,x.title,x.strSize, x.strPos ,x.runContent, x.strState)));
__loop__();
