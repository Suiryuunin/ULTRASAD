"use strict";

levels[5] = document.createElement("canvas").getContext("2d");
levels[5].canvas.width = res["w"];
levels[5].canvas.height = res["h"];

levels[5].cleared = false;
levels[5].doors =
[
    new Img({x:0         , y:res.h-128, w:64, h:256, o:{x:0,y:-1}}, _DOORIMG, _BLOCKALL)
];

levels[5].rockPile =
[
    new RockPile({x:res.w-64, y:res.h-128, w:128, h:128, o:{x:-0.5,y:-1}}, _PLATFORMIMG, _BLOCKALL)
];

for (const door of levels[5].doors)
    door.active = false;

levels[5].BACKGROUND = document.createElement("canvas").getContext("2d");
levels[5].BACKGROUND.canvas.width = res.w;
levels[5].BACKGROUND.canvas.height = res.h;
levels[5].background =
[
];

for (let i = 0; i < res.h/ws.h-1;i++)
{
    // Walls
    if (i < res.h/ws.h-4)
    {
        levels[5].background.push(new Img({x:0, y:ws.h*i, w:ws.w, h:ws.h, o:{x:0,y:0}}, _WALLIMG, _WALLC))
        levels[5].background.push(new Img({x:res.w-ws.w/2, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLC, -1));
    }
    else if (i == Math.ceil(res.h/ws.h-4))
    {
        levels[5].background.push(new Img({x:0, y:ws.h*i, w:ws.w, h:ws.h, o:{x:0,y:0}}, _WALLIMG, _WALLB))
        levels[5].background.push(new Img({x:res.w-ws.w/2, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLB, -1));
    }
}


// Floor
for (let i = 0; i < res.w/fs.h-1;i++)
{
    if (i % 2 == 0)
    {
        levels[5].background.push(new Img({x:128*i, y:res.h-128, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORMC, Math.round(Math.random())*2-1));
    }
    else
    {
        levels[5].background.push(new Img({x:128*i, y:res.h-128, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORM, Math.round(Math.random())*2-1));
    }
}

levels[5].boss =
[
    new Maurice({x:_VCENTER.x, y:256, w:128, h:128, o:{x:-0.5,y:-0.5}}, _DroneIMG["drone"], _BLOCKALL, PLAYER, 35, 35, "MAURICE")
];

levels[5].FOREGROUND = document.createElement("canvas").getContext("2d");
levels[5].FOREGROUND.canvas.width = res.w;
levels[5].FOREGROUND.canvas.height = res.h;
levels[5].foreground =
[
];

levels[5].background.push(...levels[5].rockPile);

levels[5].BLOOD = [];
levels[5].BLOODCTX = document.createElement("canvas").getContext("2d");
levels[5].BLOODCTX.canvas.width = res.w;
levels[5].BLOODCTX.canvas.height = res.h;
levels[5].FOREGROUNDQUEUE = [];



window.addEventListener("load", () => {
    for (const element of levels[5].background)
    {
        if (element.visible)
        {
            element.render(levels[5].BACKGROUND);
        }
    }

    for (const element of levels[5].foreground)
    {
        if (element.visible)
        {
            element.render(levels[5].FOREGROUND);
        }
    }
});