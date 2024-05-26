const res = {w:1920, h:1080};

//Collision preset
const _NOCOLLISION = {l:false, r:false, t:false, b:false};
const _BLOCKALL = {l:true, r:true, t:true, b:true};
const _PLATFORMC = {l:false, r:false, t:true, b:true};
const _PLATFORMR = {l:false, r:true, t:true, b:true};
const _PLATFORML = {l:true, r:false, t:true, b:true};
const _PLATFORM = {l:false, r:false, t:true, b:false};
const _WALLC = {l:true, r:true, t:false, b:false};
const _WALLT = {l:true, r:true, t:true, b:false};
const _WALLB = {l:true, r:true, t:false, b:true};

// Wall size
const ws = {w:64, h:128};

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

const display = new Display(canvas);

let levels = [];
let lIndex = 0;

let currentCtx = document.createElement("canvas").getContext("2d");
let prevCtx = document.createElement("canvas").getContext("2d");

let ALL = [];
let UI = [];
const UICTX = document.createElement("canvas").getContext("2d");
UICTX.canvas.width = res.w;
UICTX.canvas.height = res.h;


let BLOODGENERATORS = [];
const DARKCTX = document.createElement("canvas").getContext("2d");
DARKCTX.canvas.width = res.w;
DARKCTX.canvas.height = res.h;

const _sP = "Assets/Characters/Player/Soul/soul000";
const pFrames = [];
for (let i = 0; i < 3; i++)
{
    pFrames.push(_sP+i+".png");
}

let PLAYER = new Player("ani", {x:212,y:0,w:64,h:128,o:_CENTEROFFSET},pFrames);
PLAYER.name = "player";

function switchLevel(level = 1)
{
    lIndex += level;
    
    if (lIndex < 0)
    {
        lIndex = 0;
        return;
    }
    else if (lIndex >= levels.length)
    {
        lIndex = levels.length-1;
        return;
    }

    transitionDirection = level;

    _TRANSITIONING = true;

    prevCtx = currentCtx;
    currentCtx = levels[lIndex];

    ALL = [];
    ALL.push(...currentCtx.background, ...currentCtx.boss, ...currentCtx.foreground);

    UI =
    [
        new HealthBar({x:64, y:res.h-64, w:512, h:64, o:{x:0, y:-0.5}}, PLAYER, "red", "#ff9438", "black", "V1'S SOUL")
    ];

    let count = 0;
    for (const boss of currentCtx.boss)
    {
        UI.push(new HealthBar({x:256, y:64+count*48, w:res.w-512, h:64, o:{x:0, y:-0.5}}, boss, "red", "#ff9438", "black", boss.name));
        count++;
    }
}

document.addEventListener('contextmenu', event => event.preventDefault());