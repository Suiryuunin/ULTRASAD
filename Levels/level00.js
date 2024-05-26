"use strict";

levels[0] = document.createElement("canvas").getContext("2d");
levels[0].canvas.width = res["w"];
levels[0].canvas.height = res["h"];

levels[0].BACKGROUND = document.createElement("canvas").getContext("2d");
levels[0].BACKGROUND.canvas.width = res.w;
levels[0].BACKGROUND.canvas.height = res.h;
levels[0].background =
[
    new Box({x:_VCENTER.x, y:res.h, w:res.w, h:128, o:{x:-0.5,y:-1}}, "maroon"),
    new SwordProp({x:_VCENTER.x, y:_VCENTER.y+208, w:16, h:128, o:{x:-0.5,y:-1}}),
    new Img({x:_VCENTER.x, y:_VCENTER.y+284, w:64, h:128, o:{x:-0.5,y:-1}}, _PEDESTALIMG, _BLOCKALL),
    new Img({x:_VCENTER.x, y:res.h-256, w:64, h:128, o:{x:-0.5,y:0}}, _PEDESTALIMG, _BLOCKALL),
    new Img({x:_VCENTER.x-128, y:_VCENTER.y+256, w:128, h:32, o:{x:-0.5,y:-0.5}}, _PLATFORMIMG, _PLATFORML),
    new Img({x:_VCENTER.x, y:_VCENTER.y+252, w:128, h:24, o:{x:-0.5,y:-0.5}}, _PLATFORMIMG, _PLATFORM),
    new Img({x:_VCENTER.x+128, y:_VCENTER.y+256, w:128, h:32, o:{x:-0.5,y:-0.5}}, _PLATFORMIMG, _PLATFORMR),
    new Word({x:256, y:res.h-256, h:32, o:{x:-0.5,y:-0.5}}, ["MOVE WITH A & D"], "white"),
    new Word({x:608, y:res.h-512, h:32, o:{x:-0.5,y:-0.5}}, ["JUMP WITH K","YOU CAN DOUBLE JUMP"], "white"),
    new Word({x:res.w-608, y:res.h-504, h:32, o:{x:-0.5,y:-0.5}}, ["DASH WITH LSHIFT"], "white"),
    new Word({x:res.w-256, y:res.h-320, h:32, o:{x:-0.5,y:-0.5}}, ["HOLD J TO CHARGE", "RELEASE TO ATTACK"], "white")
];

for (let i = 0; i < res.h/ws.h-1;i++)
{
    // Walls
    levels[0].background.push(new Img({x:0, y:ws.h*i, w:ws.w, h:ws.h, o:{x:0,y:0}}, _WALLIMG, _WALLC));
    
    if (i < res.h/ws.h-4)
    {
        levels[0].background.push(new Img({x:res.w-ws.w/2, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLC, -1));
        levels[0].background.push(new Img({x:384, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLC, -1));
    }
    else if (i == Math.ceil(res.h/ws.h-4))
    {
        levels[0].background.push(new Img({x:res.w-ws.w/2, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _BLOCKALL, -1));
        levels[0].background.push(new Img({x:384, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _BLOCKALL, -1));
    }
}

levels[0].boss =
[
    new Drone({x:res.w-48, y:res.h-192, w:96, h:96, o:{x:-0.5,y:-0.5}}, _DroneIMG["drone"], _BLOCKALL, PLAYER, 1, 32, "drone...", true)
];

levels[0].FOREGROUND = document.createElement("canvas").getContext("2d");
levels[0].FOREGROUND.canvas.width = res.w;
levels[0].FOREGROUND.canvas.height = res.h;
levels[0].foreground =
[
    // new Box({x:_VCENTER.x+128, y:_VCENTER.y+256, w:128, h:32, o:{x:-0.5,y:-0.5}}, "hotpink", _PLATFORM),
];

levels[0].BLOOD = [];
levels[0].BLOODCTX = document.createElement("canvas").getContext("2d");
levels[0].BLOODCTX.canvas.width = res.w;
levels[0].BLOODCTX.canvas.height = res.h;
levels[0].FOREGROUNDQUEUE = [];

currentCtx = levels[0];

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



window.addEventListener("load", () => {
    for (const element of levels[0].background)
    {
        if (element.visible)
        {
            element.render(levels[0].BACKGROUND);
        }
    }

    for (const element of levels[0].foreground)
    {
        if (element.visible)
        {
            element.render(levels[0].FOREGROUND);
        }
    }
});