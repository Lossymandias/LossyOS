let gScale = 0.4;

function updateScale() {
  const w = window.innerWidth, h = window.innerHeight;
  gScale = (w * 960 + h * 461) / (w * w + h * h);
}

updateScale();
window.addEventListener("resize", updateScale);

let gSizeCanvas = [0,0]; 
function setSizeCanvas(c) { gSizeCanvas = c; }
function getSizeCanvas() {return gSizeCanvas;}

const gAttrVisStyle={ 
     "BASE":{"winBkd": "#FFF", "winBorBkd": "#000", "winBorSpace":2, "winBarBkd": "#000", "winBarHeight": 16, "winBottomBarHeigh":15,"winRendLineSpace":3},
};

const gAttrDefaultWin=[
     {
          "sstrdId" : "",
          "title" : "The Mirror",
          "runContent" :"wEMain",
          "strPos" : [426/960, 17/461],
          "strSize" : [525, 300],
          "strState" : true
     },{
          "sstrdId" : "",
          "title" : "Projects",
          "runContent" :"wEProjects",
          "strPos" : [5/960, 5/461],
          "strSize" : [200, 400],
          "strState" : true,
     },
     {
          "sstrdId" : "",
          "title" : "Experience",
          "runContent" :"wEExperince",
          "strPos" : [169/960, 214/461],
          "strSize" : [175, 225],
          "strState" : true
     },{
          "sstrdId" : "",
          "title" : "?",
          "runContent" :"wECreatura",
          "strPos" : [250/960, 15/461],
          "strSize" : [400, 400],
          "strState" : false
     },{
          "sstrdId" : "",
          "title" : "Education",
          "runContent" :"wEEducation",
          "strPos" : [467/960, 329/461],
          "strSize" : [300, 100]
          ,"strState" : true
     },{
          "sstrdId" : "",
          "title" : "Contact me!",
          "runContent" :"wEContact",
          "strPos" : [237/960, 129/461],
          "strSize" : [250, 75]
          ,"strState" : false
     },{
          "sstrdId" : "",
          "title" : "Languages",
          "runContent" :"wELanguage",
          "strPos" : [527/960, 80/461],
          "strSize" : [200, 100]
          ,"strState" : false
     },
]
/*
,
   
     {
          "sstrdId" : "",
          "title" : "P=NP",
          "runContent" :"wEMain",
          "strPos" : [300,400],
          "strSize" : [260,200]
     }
 */

export {gAttrVisStyle, gAttrDefaultWin, gScale, setSizeCanvas,getSizeCanvas};