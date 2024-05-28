const res = {w:1920, h:1080};
const display = new Display(canvas);

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
const fs = {w:128, h:32};
const fs2 = {w:128, h:24};

const _GRAVITY = -1.2;
const _VCENTER = {x: Math.floor(res.w/2), y: Math.floor(res.h/2)};
const _NOOFFSET = {x:0,y:0};
const _CENTEROFFSET = {x:-0.5,y:-0.5};

const _ULTRASAD = new Img({x:_VCENTER.x, y:_VCENTER.y, w:res.w,h:res.h, o:_CENTEROFFSET}, _ULTRASADIMG, _NOCOLLISION);

const EXPLOSIONIMG = new Image();
EXPLOSIONIMG.src = "Assets/Textures/explosion.png";
const BIGEXPLOSIONIMG = new Image();
BIGEXPLOSIONIMG.src = "Assets/Textures/bigExplosion.png";
let explosions = [];


const FPSDISPLAY = new Word({x:res.w-256, y:res.h-16, h:32, o:{x:0,y:0}}, ["0"], "white");
const FPSDISPLAYR = new Word({x:res.w-256, y:res.h-32-16, h:32, o:{x:0,y:0}}, ["0"], "white");

const RESTARTSCOUNT = new Word({x:res.w-512-128, y:res.h-32-16, h:32, o:{x:0,y:0}}, ["0"], "white");
const RESTARTSCOUNTR = new Word({x:res.w-512-128, y:res.h-16, h:32, o:{x:0,y:0}}, ["0"], "white");

const TIMER = new Word({x:_VCENTER.x, y:res.h-48, h:48, o:{x:-0.5,y:-0.5}}, ["0"], "white");

function toCanvasCoords(pageX, pageY)
{
    const _rect = document.querySelector("canvas").getBoundingClientRect();
    const scale = {x: canvas.width/currentCtx.canvas.width, y: canvas.height/currentCtx.canvas.height};
    
    let x = (pageX-_rect.left) / scale.x;
    let y = (pageY-_rect.top) / scale.y;

    return {x, y};
}

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

let POPUPQUEUE = [];

function addLight(ctx, xStart, yStart, rStart, xEnd, yEnd, rEnd)
{
    DARKCTX.globalCompositeOperation = 'xor';
    const g = ctx.createRadialGradient(xStart, yStart, rStart, xEnd, yEnd, rEnd);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    g.addColorStop(0, `rgba(0,0,0,1)`);
    ctx.fillStyle = g;
    ctx.fillRect(xStart - rEnd, yStart - rEnd, xEnd + rEnd, yEnd + rEnd);
    ctx.fillStyle = `rgba(0,0,0,1)`;
}

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

    lIndex = 6;

    transitionDirection = level;

    _TRANSITIONING = true;

    prevCtx = currentCtx;
    currentCtx = levels[lIndex];

    ALL = [];
    ALL.push(...currentCtx.background, ...currentCtx.boss, ...currentCtx.foreground, ...currentCtx.doors);

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
    if (currentCtx.rockPile)
        for (const rockPile of currentCtx.rockPile)
        {
            UI.push(new HealthBar({x:256, y:64+count*48, w:res.w-512, h:64, o:{x:0, y:-0.5}}, rockPile, "red", "#ff9438", "black", rockPile.name));
            count++;
        }
}

document.addEventListener('contextmenu', event => event.preventDefault());