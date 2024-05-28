"use strict";

levels[14] = document.createElement("canvas").getContext("2d");
levels[14].canvas.width = res["w"];
levels[14].canvas.height = res["h"];
levels[14].restarts = 0;

levels[14].st =
{
    x:128,
    y:res.h-192
};

levels[14].cleared = false;
levels[14].doors =
[
];

for (const door of levels[14].doors)
    door.active = false;

levels[14].BACKGROUND = document.createElement("canvas").getContext("2d");
levels[14].BACKGROUND.canvas.width = res.w;
levels[14].BACKGROUND.canvas.height = res.h;
levels[14].background =
[
    new Box({x:0,y:res.h-128, w:res.w, h:512, o:{x:0,y:0}}, "rgba(0,0,0,0)", _BLOCKALL),
    new Word({x:_VCENTER.x, y:_VCENTER.y, h:128, o:{x:-0.5,y:-0.5}}, ["UNDER CONSTRUCTION"], "red")
];

for (let i = 0; i < res.h/ws.h-1;i++)
{
    levels[14].background.push(new Img({x:res.w-ws.w/2, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLC, -1));
    // Walls
    if (i < res.h/ws.h-4)
    {
        levels[14].background.push(new Img({x:0, y:ws.h*i, w:ws.w, h:ws.h, o:{x:0,y:0}}, _WALLIMG, _WALLC))
    }
    else if (i == Math.ceil(res.h/ws.h-4))
    {
        levels[14].background.push(new Img({x:0, y:ws.h*i, w:ws.w, h:ws.h, o:{x:0,y:0}}, _WALLIMG, _WALLB))
    }
}


// Floor
for (let i = 0; i < res.w/fs.h-1;i++)
{
    if (i % 2 == 0)
    {
        levels[14].background.push(new Img({x:128*i, y:res.h-128, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _NOCOLLISION, Math.round(Math.random())*2-1));
    }
    else
    {
        levels[14].background.push(new Img({x:128*i, y:res.h-128, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _NOCOLLISION, Math.round(Math.random())*2-1));
    }
}

levels[14].boss =
[
];

levels[14].FOREGROUND = document.createElement("canvas").getContext("2d");
levels[14].FOREGROUND.canvas.width = res.w;
levels[14].FOREGROUND.canvas.height = res.h;
levels[14].foreground =
[
];

levels[14].BLOOD = [];
levels[14].BLOODCTX = document.createElement("canvas").getContext("2d");
levels[14].BLOODCTX.canvas.width = res.w;
levels[14].BLOODCTX.canvas.height = res.h;
levels[14].FOREGROUNDQUEUE = [];



window.addEventListener("load", () => {
    for (const element of levels[14].background)
    {
        if (element.visible)
        {
            element.render(levels[14].BACKGROUND);
        }
    }

    for (const element of levels[14].foreground)
    {
        if (element.visible)
        {
            element.render(levels[14].FOREGROUND);
        }
    }
});

levels[14].reset = () =>
{
    currentCtx.restarts++;

    currentCtx.cleared = false;

    currentCtx.boss =
    [
    ];

    currentCtx.FOREGROUNDQUEUE = [];
    ALL = [];
    ALL.push(...currentCtx.background, ...currentCtx.boss, ...currentCtx.foreground, ...currentCtx.doors);

    UI =
    [
        new HealthBar({x:64, y:res.h-64, w:512, h:64, o:{x:0, y:-0.5}}, PLAYER, "red", "#ff9438", "black", "V1'S SOUL")
    ];
}