levels[1] = document.createElement("canvas").getContext("2d");
levels[1].canvas.width = res["w"];
levels[1].canvas.height = res["h"];
levels[1].restarts = 0;

levels[1].st =
{
    x:128,
    y:res.h-192
};

levels[1].cleared = false;
levels[1].doors =
[
    new Img({x:res.w-64/2, y:res.h-56, w:64, h:256, o:{x:-0.5,y:-1}}, _DOORIMG, _BLOCKALL, 1),
    new Img({x:0         , y:res.h-56, w:64, h:256, o:{x:0,y:-1}}, _DOORIMG, _BLOCKALL)
];

for (const door of levels[1].doors)
    door.active = false;

levels[1].BACKGROUND = document.createElement("canvas").getContext("2d");
levels[1].BACKGROUND.canvas.width = res.w;
levels[1].BACKGROUND.canvas.height = res.h;
levels[1].background =
[
    new Box({x:0,y:res.h-128, w:res.w, h:512, o:{x:0,y:0}}, "rgba(0,0,0,0)", _BLOCKALL),
    new Img({x:_VCENTER.x-384, y:_VCENTER.y+256-16, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORML),
    new Img({x:_VCENTER.x-256, y:_VCENTER.y+256-16, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORM),
    new Img({x:_VCENTER.x-128, y:_VCENTER.y+256-16, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORMC),
    new Img({x:_VCENTER.x,     y:_VCENTER.y+256-16, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORM),
    new Img({x:_VCENTER.x+128, y:_VCENTER.y+256-16, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORMC, -1),
    new Img({x:_VCENTER.x+256, y:_VCENTER.y+256-16, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORM, -1),
    new Img({x:_VCENTER.x+384, y:_VCENTER.y+256-16, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _PLATFORMR, -1),
    new Word({x:_VCENTER.x, y:_VCENTER.y, h:32, o:{x:-0.5,y:-0.5}}, ["PRESS WASD BEFORE ATTACKING TO AIM","", "THE LONGER YOU CHARGE, THE MORE YOU HEAL", "IF YOU HIT THE ENEMY THAT IS..."], "white"),
    new Word({x:res.w-256, y:res.h-320, h:32, o:{x:-0.5,y:-0.5}}, ["FOR THE DOOR TO OPEN","ALL ENEMIES MUST DIE"], "white")
];

for (let i = 0; i < res.h/ws.h-1;i++)
{
    // Walls
    if (i < res.h/ws.h-4)
    {
        levels[1].background.push(new Img({x:0, y:ws.h*i, w:ws.w, h:ws.h, o:{x:0,y:0}}, _WALLIMG, _WALLC))
        levels[1].background.push(new Img({x:res.w-ws.w/2, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLC, -1));
    }
    else if (i == Math.ceil(res.h/ws.h-4))
    {
        levels[1].background.push(new Img({x:0, y:ws.h*i, w:ws.w, h:ws.h, o:{x:0,y:0}}, _WALLIMG, _WALLB))
        levels[1].background.push(new Img({x:res.w-ws.w/2, y:ws.h*i, w:ws.w, h:ws.h, o:{x:-0.5,y:0}}, _WALLIMG, _WALLB, -1));
    }
}

// Floor
for (let i = 0; i < res.w/fs.h-1;i++)
{
    if (i % 2 == 0)
    {
        levels[1].background.push(new Img({x:128*i, y:res.h-128, w:128, h:32, o:{x:-0.5,y:0}}, _PLATFORMIMG, _NOCOLLISION, Math.round(Math.random())*2-1));
    }
    else
    {
        levels[1].background.push(new Img({x:128*i, y:res.h-128, w:128, h:24, o:{x:-0.5,y:0}}, _PLATFORMIMG, _NOCOLLISION, Math.round(Math.random())*2-1));
    }
}

levels[1].boss =
[
    new Maurice({x:_VCENTER.x+0.0000001, y:256, w:128, h:128, o:{x:-0.5,y:-0.5}}, _MauriceIMG["maurice"], _BLOCKALL, PLAYER, 1, 35, "SAD FACE", true)
];

levels[1].FOREGROUND = document.createElement("canvas").getContext("2d");
levels[1].FOREGROUND.canvas.width = res.w;
levels[1].FOREGROUND.canvas.height = res.h;
levels[1].foreground =
[
];

levels[1].BLOOD = [];
levels[1].BLOODCTX = document.createElement("canvas").getContext("2d");
levels[1].BLOODCTX.canvas.width = res.w;
levels[1].BLOODCTX.canvas.height = res.h;
levels[1].FOREGROUNDQUEUE = [];

window.addEventListener("load", () => {
    for (const element of levels[1].background)
    {
        if (element.visible)
        {
            element.render(levels[1].BACKGROUND);
        }
    }

    for (const element of levels[1].foreground)
    {
        if (element.visible)
        {
            element.render(levels[1].FOREGROUND);
        }
    }
});

levels[1].reset = () =>
{
    currentCtx.restarts++;
    currentCtx.cleared = false;
    currentCtx.boss =
    [
        new Maurice({x:_VCENTER.x+0.0000001, y:256, w:128, h:128, o:{x:-0.5,y:-0.5}}, _MauriceIMG["maurice"], _BLOCKALL, PLAYER, 1, 35, "SAD FACE", true)
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