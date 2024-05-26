"use strict";

levels[2] = document.createElement("canvas").getContext("2d");
levels[2].canvas.width = res["w"];
levels[2].canvas.height = res["h"];

levels[2].BACKGROUND = document.createElement("canvas").getContext("2d");
levels[2].BACKGROUND.canvas.width = res.w;
levels[2].BACKGROUND.canvas.height = res.h;
levels[2].background =
[
    new Box({x:_VCENTER.x, y:res.h, w:res.w, h:128, o:{x:-0.5,y:-1}}, "maroon"),
    new Img({x:_VCENTER.x-128-64, y:_VCENTER.y, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORML),
    new Img({x:_VCENTER.x, y:_VCENTER.y-256+16, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORM),
    new Img({x:_VCENTER.x+128+64, y:_VCENTER.y, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORMR),

    new Img({x:_VCENTER.x-512, y:_VCENTER.y+256-16, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORM),
    new Img({x:_VCENTER.x, y:_VCENTER.y+256-16, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORM),
    new Img({x:_VCENTER.x+512, y:_VCENTER.y+256-16, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORM),


    new Word({x:512+128, y:res.h-512-256, h:32, o:{x:-0.5,y:-0.5}}, ["CHARGING CREATES A FORCE FIELD THAT TRAPS BULLETS","RELEASING WILL SHOOT THEM", "OTHER BULLETS HITTING YOUR BULLETS WILL EXPLODE"], "white"),
    new Word({x:res.w-(512+128), y:res.h-512, h:32, o:{x:-0.5,y:-0.5}}, ["WHEN ENEMIES' HEALTH IS BELOW 50%", "THEY FALL INTO AN ENRAGED STATE"], "white")
];

for (let i = 0; i < res.h/ws.h-1;i++)
{
    // Walls
    if (i < res.h/ws.h-4)
    {
        levels[2].background.push(new Img({x:0, y:ws.h*i, w:ws.w, h:ws.h, o:{x:0,y:0}}, _WALLIMG, _WALLC))
        levels[2].background.push(new Img({x:res.w-ws.w/2, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLC, -1));
    }
    else if (i == Math.ceil(res.h/ws.h-4))
    {
        levels[2].background.push(new Img({x:0, y:ws.h*i, w:ws.w, h:ws.h, o:{x:0,y:0}}, _WALLIMG, _WALLB))
        levels[2].background.push(new Img({x:res.w-ws.w/2, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLB, -1));
    }
}

levels[2].boss =
[
    new Drone({x:_VCENTER.x, y:_VCENTER.y, w:96, h:96, o:{x:-0.5,y:-0.5}}, _DroneIMG["drone"], _BLOCKALL, PLAYER, 2, 2, "DRONE")
];

levels[2].FOREGROUND = document.createElement("canvas").getContext("2d");
levels[2].FOREGROUND.canvas.width = res.w;
levels[2].FOREGROUND.canvas.height = res.h;
levels[2].foreground =
[
];

levels[2].BLOOD = [];
levels[2].BLOODCTX = document.createElement("canvas").getContext("2d");
levels[2].BLOODCTX.canvas.width = res.w;
levels[2].BLOODCTX.canvas.height = res.h;
levels[2].FOREGROUNDQUEUE = [];



window.addEventListener("load", () => {
    for (const element of levels[2].background)
    {
        if (element.visible)
        {
            element.render(levels[2].BACKGROUND);
        }
    }

    for (const element of levels[2].foreground)
    {
        if (element.visible)
        {
            element.render(levels[2].FOREGROUND);
        }
    }
});