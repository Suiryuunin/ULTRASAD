"use strict";

levels[8] = document.createElement("canvas").getContext("2d");
levels[8].canvas.width = res["w"];
levels[8].canvas.height = res["h"];
levels[8].restarts = 0;

levels[8].st =
{
    x:128,
    y:res.h-192
};

levels[8].cleared = false;
levels[8].doors =
[
];

levels[8].hints =
[
];

for (const door of levels[8].doors)
    door.active = false;

levels[8].BACKGROUND = document.createElement("canvas").getContext("2d");
levels[8].BACKGROUND.canvas.width = res.w;
levels[8].BACKGROUND.canvas.height = res.h;
levels[8].background =
[
    new Word({x:_VCENTER.x, y:res.h-256, h:48, o:{x:-0.5,y:-0.5}}, ["FINALLY...HELL", "FIRST LAYER: LIMBO"], "red"),
];

for (let i = 0; i < res.h/ws.h-1;i++)
{
    levels[8].background.push(new Img({x:0, y:ws.h*i, w:ws.w, h:ws.h, o:{x:0,y:0}}, _WALLIMG, _WALLC));
    // Walls
    if (i < res.h/ws.h-4)
        {
        levels[8].background.push(new Img({x:_VCENTER.x-128, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLC))
        levels[8].background.push(new Img({x:_VCENTER.x+128, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLC, -1));
    }
    else if (i == Math.ceil(res.h/ws.h-4))
    {
        levels[8].background.push(new Img({x:_VCENTER.x-128, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLB))
        levels[8].background.push(new Img({x:_VCENTER.x+128, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLC, -1));
    }
}


// Floor
for (let i = 0; i < res.w/fs.h-1;i++)
{
    if (i % 2 == 0)
    {
        levels[8].background.push(new Img({x:128*i, y:res.h-128, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORMC, Math.round(Math.random())*2-1));
    }
    else
    {
        levels[8].background.push(new Img({x:128*i, y:res.h-128, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORM, Math.round(Math.random())*2-1));
    }
}

levels[8].boss =
[
];

levels[8].FOREGROUND = document.createElement("canvas").getContext("2d");
levels[8].FOREGROUND.canvas.width = res.w;
levels[8].FOREGROUND.canvas.height = res.h;
levels[8].foreground =
[
];

levels[8].BLOOD = [];
levels[8].BLOODCTX = document.createElement("canvas").getContext("2d");
levels[8].BLOODCTX.canvas.width = res.w;
levels[8].BLOODCTX.canvas.height = res.h;
levels[8].FOREGROUNDQUEUE = [];



window.addEventListener("load", () => {
    for (const element of levels[8].background)
    {
        if (element.visible)
        {
            element.render(levels[8].BACKGROUND);
        }
    }

    for (const element of levels[8].foreground)
    {
        if (element.visible)
        {
            element.render(levels[8].FOREGROUND);
        }
    }
});

levels[8].reset = () =>
{
    currentCtx.restarts++;
    currentCtx.cleared = false;
    
    currentCtx.FOREGROUNDQUEUE = [];
    ALL = [];
    ALL.push(...currentCtx.background, ...currentCtx.boss, ...currentCtx.foreground, ...currentCtx.doors);

    UI =
    [
        new HealthBar({x:64, y:res.h-64, w:512, h:64, o:{x:0, y:-0.5}}, PLAYER, "red", "#ff9438", "black", "V1'S SOUL")
    ];
}