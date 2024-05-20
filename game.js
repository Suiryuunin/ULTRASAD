const res = {w:1920, h:1080};

const _NOCOLLISION = {l:false, r:false, t:false, b:false};
const _BLOCKALL = {l:true, r:true, t:true, b:true};
const _PLATFORM = {l:false, r:false, t:true, b:false};
const _GRAVITY = -1.2;
const _VCENTER = {x: Math.floor(res.w/2), y: Math.floor(res.h/2)};
const _NOOFFSET = {x:0,y:0};
const _CENTEROFFSET = {x:-0.5,y:-0.5};

const EXPLOSIONIMG = new Image();
EXPLOSIONIMG.src = "Assets/Textures/explosion.png";
const BIGEXPLOSIONIMG = new Image();
BIGEXPLOSIONIMG.src = "Assets/Textures/bigExplosion.png";
let explosions = [];

function toCanvasCoords(pageX, pageY)
{
    const _rect = document.querySelector("canvas").getBoundingClientRect();
    const scale = {x: canvas.width/currentCtx.canvas.width, y: canvas.height/currentCtx.canvas.height};
    
    let x = (pageX-_rect.left) / scale.x;
    let y = (pageY-_rect.top) / scale.y;

    return {x, y};
}
let FOREGROUNDQUEUE = [];
let BLOOD = [];
let BLOODGENERATORS = [];

const playerIMG = new Image(64, 128);
playerIMG.src = "Assets/Textures/bg720p.jpg";

const _sP = "Assets/Characters/Player/Soul/soul000";
const pFrames = [];
for (let i = 0; i < 3; i++)
{
    pFrames.push(_sP+i+".png");
}

let PLAYER = new Player("ani", {x:_VCENTER.x,y:_VCENTER.y,w:64,h:128,o:_CENTEROFFSET},pFrames);
PLAYER.name = "player";

document.addEventListener('contextmenu', event => event.preventDefault());