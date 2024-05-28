"use strict";

levels[7] = document.createElement("canvas").getContext("2d");
levels[7].canvas.width = res["w"];
levels[7].canvas.height = res["h"];
levels[7].restarts = 0;

levels[7].st =
{
    x:128,
    y:res.h-192
};

levels[7].cleared = false;
levels[7].doors =
[
];

levels[7].hints =
[
    new Word({x:_VCENTER.x, y:_VCENTER.y, h:64, o:{x:-0.5,y:-0.5}}, ["MAKE MAURICE COMMIT SUICIDE"], "green")
];

for (const door of levels[7].doors)
    door.active = false;

levels[7].BACKGROUND = document.createElement("canvas").getContext("2d");
levels[7].BACKGROUND.canvas.width = res.w;
levels[7].BACKGROUND.canvas.height = res.h;
levels[7].background =
[
    new Img({x:_VCENTER.x-128, y:ws.h*7.5, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLT),
    new Img({x:_VCENTER.x+128, y:ws.h*7.5, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLT, -1)
];

for (let i = 0; i < res.h/ws.h-1;i++)
{
    levels[7].background.push(new Img({x:res.w-ws.w/2, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLC, -1));
    // Walls
    if (i < res.h/ws.h-4)
    {
        levels[7].background.push(new Img({x:0, y:ws.h*i, w:ws.w, h:ws.h, o:{x:0,y:0}}, _WALLIMG, _WALLC))
    }
    else if (i == Math.ceil(res.h/ws.h-4))
    {
        levels[7].background.push(new Img({x:0, y:ws.h*i, w:ws.w, h:ws.h, o:{x:0,y:0}}, _WALLIMG, _WALLB))
    }
}


// Floor
for (let i = 0; i < res.w/fs.h-1;i++)
{
    if (i < 7 || i > 8)
    {
        if (i % 2 == 0)
        {
            levels[7].background.push(new Img({x:128*i, y:res.h-128, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, (i == 6) ? _PLATFORMR :  ((i == 9) ? _PLATFORML : _PLATFORMC), Math.round(Math.random())*2-1));
        }
        else
        {
            levels[7].background.push(new Img({x:128*i, y:res.h-128, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORM, Math.round(Math.random())*2-1));
        }
    }
    
    
}

levels[7].boss =
[
];

levels[7].FOREGROUND = document.createElement("canvas").getContext("2d");
levels[7].FOREGROUND.canvas.width = res.w;
levels[7].FOREGROUND.canvas.height = res.h;
levels[7].foreground =
[
];

levels[7].BLOOD = [];
levels[7].BLOODCTX = document.createElement("canvas").getContext("2d");
levels[7].BLOODCTX.canvas.width = res.w;
levels[7].BLOODCTX.canvas.height = res.h;
levels[7].FOREGROUNDQUEUE = [];



window.addEventListener("load", () => {
    for (const element of levels[7].background)
    {
        if (element.visible)
        {
            element.render(levels[7].BACKGROUND);
        }
    }

    for (const element of levels[7].foreground)
    {
        if (element.visible)
        {
            element.render(levels[7].FOREGROUND);
        }
    }
});

levels[7].reset = () =>
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
    
    currentCtx.FOREGROUNDQUEUE = [];
    ALL = [];
    ALL.push(...currentCtx.background, ...currentCtx.boss, ...currentCtx.foreground, ...currentCtx.doors);

    UI =
    [
        new HealthBar({x:64, y:res.h-64, w:512, h:64, o:{x:0, y:-0.5}}, PLAYER, "red", "#ff9438", "black", "V1'S SOUL")
    ];
}