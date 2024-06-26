"use strict";

levels[0] = document.createElement("canvas").getContext("2d");
levels[0].canvas.width = res["w"];
levels[0].canvas.height = res["h"];
levels[0].restarts = 0;

levels[0].dark = true;

levels[0].st =
{
    x:212,
    y:0
};

levels[0].cleared = false;
levels[0].doors =
[
];

for (const door of levels[0].doors)
    door.active = false;


levels[0].BACKGROUND = document.createElement("canvas").getContext("2d");
levels[0].BACKGROUND.canvas.width = res.w;
levels[0].BACKGROUND.canvas.height = res.h;
levels[0].background =
[
    new Box({x:0,y:res.h-128, w:res.w, h:512, o:{x:0,y:0}}, "rgba(0,0,0,0)", _BLOCKALL),
    new SwordProp({x:_VCENTER.x, y:_VCENTER.y+208+32, w:16, h:128, o:{x:-0.5,y:-1}}),
    new Img({x:_VCENTER.x-128, y:_VCENTER.y+256-32, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORML),
    new Img({x:_VCENTER.x, y:_VCENTER.y+256-32, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORM),
    new Img({x:_VCENTER.x+128, y:_VCENTER.y+256-32, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORMR),
    new Img({x:_VCENTER.x, y:_VCENTER.y+284+32, w:64, h:128, o:{x:-0.5,y:-1}}, _PEDESTALIMG, _BLOCKALL),
    new Img({x:_VCENTER.x, y:res.h-256+32, w:64, h:128, o:{x:-0.5,y:0}}, _PEDESTALIMG, _BLOCKALL, -1),
    new Word({x:208, y:_VCENTER.y, h:64, o:{x:-0.5,y:-0.5}}, ["MISSION"], "white"),
    new Word({x:208, y:_VCENTER.y+64, h:48, o:{x:-0.5,y:-0.5}}, ["0-SS"], "white"),
    new Word({x:208, y:_VCENTER.y+160-32, h:32, o:{x:-0.5,y:-0.5}}, ["FIND A WEAPON", "RETURN TO HELL"], "white"),
    new Word({x:256, y:res.h-256, h:32, o:{x:-0.5,y:-0.5}}, ["MOVE WITH [A] & [D]"], "white"),
    new Word({x:608-16, y:res.h-288-48, h:32, o:{x:-0.5,y:-0.5}}, ["JUMP WITH [K]","YOU CAN DOUBLE JUMP"], "white"),
    new Word({x:_VCENTER.x, y:res.h-504, h:32, o:{x:-0.5,y:-0.5}}, ["DASH WITH [LSHIFT]"], "white"),
    new Word({x:_VCENTER.x, y:res.h-576-128, h:48, o:{x:-0.5,y:-0.5}}, ["IF UPDATE FPS IS BELOW 60", "PRESS [ OR ]", "TO DECREMENT/INCREMENT DOWNSCALING"], "red"),
    new Word({x:res.w-256, y:res.h-320, h:32, o:{x:-0.5,y:-0.5}}, ["HOLD [J] TO CHARGE", "RELEASE TO STAB"], "white")
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

// Floor
for (let i = 0; i < res.w/fs.h-1;i++)
{
    if (i % 2 == 0)
    {
        levels[0].background.push(new Img({x:128*i, y:res.h-128, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _NOCOLLISION, Math.round(Math.random())*2-1));
    }
    else
    {
        levels[0].background.push(new Img({x:128*i, y:res.h-128, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _NOCOLLISION, Math.round(Math.random())*2-1));
    }
}

levels[0].boss =
[
    new Drone({x:res.w-48, y:res.h-192, w:96, h:96, o:{x:-0.5,y:-0.5}}, _DroneIMG["drone"], _BLOCKALL, PLAYER, 0.01, 1, "BROKEN DRONE", true)
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

levels[0].reset = () =>
{
    currentCtx.restarts++;
    currentCtx.cleared = false;

    currentCtx.boss =
    [
        new Drone({x:res.w-48, y:res.h-192, w:96, h:96, o:{x:-0.5,y:-0.5}}, _DroneIMG["drone"], _BLOCKALL, PLAYER, 0.01, 1, "BROKEN DRONE", true)
    ];
    
    currentCtx.FOREGROUNDQUEUE = [];
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
};