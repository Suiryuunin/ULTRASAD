"use strict";

levels[3] = document.createElement("canvas").getContext("2d");
levels[3].canvas.width = res["w"];
levels[3].canvas.height = res["h"];

levels[3].BACKGROUND = document.createElement("canvas").getContext("2d");
levels[3].BACKGROUND.canvas.width = res.w;
levels[3].BACKGROUND.canvas.height = res.h;
levels[3].background =
[
    new Box({x:_VCENTER.x, y:res.h, w:res.w, h:128, o:{x:-0.5,y:-1}}, "maroon"),
    new Img({x:_VCENTER.x-256, y:_VCENTER.y, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _BLOCKALL),
    new Img({x:_VCENTER.x+256, y:_VCENTER.y, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _BLOCKALL, -1),
    new Img({x:res.w-128, y:_VCENTER.y+256-16, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORM, -1),
    new Img({x:128, y:_VCENTER.y+256-16, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORM),

    new Img({x:_VCENTER.x-578, y:_VCENTER.y, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _BLOCKALL),
    new Img({x:_VCENTER.x+578, y:_VCENTER.y, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _BLOCKALL)
];

for (let i = 0; i < res.h/ws.h-1;i++)
{
    // Walls
    if (i < res.h/ws.h-4)
    {
        levels[3].background.push(new Img({x:0, y:ws.h*i, w:ws.w, h:ws.h, o:{x:0,y:0}}, _WALLIMG, _WALLC))
        levels[3].background.push(new Img({x:res.w-ws.w/2, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLC, -1));
    }
    else if (i == Math.ceil(res.h/ws.h-4))
    {
        levels[3].background.push(new Img({x:0, y:ws.h*i, w:ws.w, h:ws.h, o:{x:0,y:0}}, _WALLIMG, _WALLB))
        levels[3].background.push(new Img({x:res.w-ws.w/2, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLB, -1));
    }
}

levels[3].boss =
[
    new Maurice({x:_VCENTER.x, y:256, w:128, h:128, o:{x:-0.5,y:-0.5}}, _DroneIMG["drone"], _BLOCKALL, PLAYER, 35, 35, "MAURICE")
];

levels[3].FOREGROUND = document.createElement("canvas").getContext("2d");
levels[3].FOREGROUND.canvas.width = res.w;
levels[3].FOREGROUND.canvas.height = res.h;
levels[3].foreground =
[
];

levels[3].BLOOD = [];
levels[3].BLOODCTX = document.createElement("canvas").getContext("2d");
levels[3].BLOODCTX.canvas.width = res.w;
levels[3].BLOODCTX.canvas.height = res.h;
levels[3].FOREGROUNDQUEUE = [];



window.addEventListener("load", () => {
    for (const element of levels[3].background)
    {
        if (element.visible)
        {
            element.render(levels[3].BACKGROUND);
        }
    }

    for (const element of levels[3].foreground)
    {
        if (element.visible)
        {
            element.render(levels[3].FOREGROUND);
        }
    }
});