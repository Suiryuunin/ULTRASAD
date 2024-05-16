const res = {w:1920, h:1080};

const _NOCOLLISION = {l:false, r:false, t:false, b:false};
const _BLOCKALL = {l:true, r:true, t:true, b:true};
const _PLATFORM = {l:false, r:false, t:true, b:false};
const _GRAVITY = -1.2;
const _VCENTER = {x: Math.floor(res.w/2), y: Math.floor(res.h/2)};
const _NOOFFSET = {x:0,y:0};
const _CENTEROFFSET = {x:-0.5,y:-0.5};

function toCanvasCoords(pageX, pageY)
{
    const _rect = document.querySelector("canvas").getBoundingClientRect();
    const scale = {x: canvas.width/currentCtx.canvas.width, y: canvas.height/currentCtx.canvas.height};
    
    let x = (pageX-_rect.left) / scale.x;
    let y = (pageY-_rect.top) / scale.y;

    return {x, y};
}
const playerIMG = new Image(64, 128);
playerIMG.src = "Assets/Textures/bg720p.jpg";
const PLAYER = new Player("img", {x:_VCENTER.x,y:_VCENTER.y,w:64,h:128,o:_CENTEROFFSET},playerIMG);
PLAYER.name = "player";