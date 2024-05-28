"use strict";

levels[4] = document.createElement("canvas").getContext("2d");
levels[4].canvas.width = res["w"];
levels[4].canvas.height = res["h"];
levels[4].restarts = 0;

levels[4].st =
{
    x:128,
    y:res.h-192
};

levels[4].cleared = false;
levels[4].doors =
[
    new Img({x:res.w-64/2, y:res.h-56, w:64, h:256, o:{x:-0.5,y:-1}}, _DOORIMG, _BLOCKALL, 1),
    new Img({x:0         , y:res.h-56, w:64, h:256, o:{x:0,y:-1}}, _DOORIMG, _BLOCKALL)
];

levels[4].hints =
[
    new Word({x:_VCENTER.x, y:_VCENTER.y, h:64, o:{x:-0.5,y:-0.5}}, ["YOU CAN JUMP LOWER","BY TAPPING K QUICKLY"], "green"),
];


for (const door of levels[4].doors)
    door.active = false;

levels[4].BACKGROUND = document.createElement("canvas").getContext("2d");
levels[4].BACKGROUND.canvas.width = res.w;
levels[4].BACKGROUND.canvas.height = res.h;
levels[4].background =
[
    new Box({x:0,y:res.h-128, w:res.w, h:512, o:{x:0,y:0}}, "rgba(0,0,0,0)", _BLOCKALL),
    new Word({x:_VCENTER.x, y:_VCENTER.y+256-64, h:32, o:{x:-0.5,y:-0.5}}, ["HINTS WILL APPEAR EVERY 10 RESTARTS PER ROOM", "IF THERE ARE THAT IS..."], "white")
];

// Ceiling
for (let i = 0; i < res.w/fs.h-1;i++)
{
    if (i % 2 == 0)
    {
        levels[4].background.push(new Img({x:128*i, y:_VCENTER.y+256+16, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORMC, Math.round(Math.random())*2-1));
    }
    else
    {
        levels[4].background.push(new Img({x:128*i, y:_VCENTER.y+256+16, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORM, Math.round(Math.random())*2-1));
    }
}

// Floor
for (let i = 0; i < res.w/fs.h-1;i++)
{
    if (i % 2 == 0)
    {
        levels[4].background.push(new Img({x:128*i, y:res.h-128, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _NOCOLLISION, Math.round(Math.random())*2-1));
    }
    else
    {
        levels[4].background.push(new Img({x:128*i, y:res.h-128, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _NOCOLLISION, Math.round(Math.random())*2-1));
    }
}

for (let i = 0; i < res.h/ws.h-1;i++)
{
    // Walls
    if (i < res.h/ws.h-4)
    {
        levels[4].background.push(new Img({x:0, y:ws.h*i, w:ws.w, h:ws.h, o:{x:0,y:0}}, _WALLIMG, _WALLC))
        levels[4].background.push(new Img({x:res.w-ws.w/2, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLC, -1));
    }
    else if (i == Math.ceil(res.h/ws.h-4))
    {
        levels[4].background.push(new Img({x:0, y:ws.h*i, w:ws.w, h:ws.h, o:{x:0,y:0}}, _WALLIMG, _WALLB))
        levels[4].background.push(new Img({x:res.w-ws.w/2, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLB, -1));
    }
}

levels[4].boss =
[
    new Maurice({x:_VCENTER.x, y:256, w:128, h:128, o:{x:-0.5,y:-0.5}}, _MauriceIMG["maurice"], _BLOCKALL, PLAYER, 1.1, 35, "SAD MAURICE", "NOCHARGE", 1)
];

levels[4].FOREGROUND = document.createElement("canvas").getContext("2d");
levels[4].FOREGROUND.canvas.width = res.w;
levels[4].FOREGROUND.canvas.height = res.h;
levels[4].foreground =
[
];

levels[4].BLOOD = [];
levels[4].BLOODCTX = document.createElement("canvas").getContext("2d");
levels[4].BLOODCTX.canvas.width = res.w;
levels[4].BLOODCTX.canvas.height = res.h;
levels[4].FOREGROUNDQUEUE = [];



window.addEventListener("load", () => {
    for (const element of levels[4].background)
    {
        if (element.visible)
        {
            element.render(levels[4].BACKGROUND);
        }
    }

    for (const element of levels[4].foreground)
    {
        if (element.visible)
        {
            element.render(levels[4].FOREGROUND);
        }
    }
});

levels[4].reset = () =>
{
    currentCtx.restarts++;

    if (currentCtx.restarts == 10)
    {
        currentCtx.background.push(...currentCtx.hints);

        currentCtx.BACKGROUND.clearRect(0,0,res.w,res.h);
        for (const element of currentCtx.background)
        {
            if (element.visible)
            {
                element.render(currentCtx.BACKGROUND);
            }
        }
    }

    currentCtx.cleared = false;
    currentCtx.boss =
    [
        new Maurice({x:_VCENTER.x, y:256, w:128, h:128, o:{x:-0.5,y:-0.5}}, _MauriceIMG["maurice"], _BLOCKALL, PLAYER, 1.1, 35, "SAD MAURICE", "NOCHARGE", 1)
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
}