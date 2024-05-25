"use strict";

levels[0] = document.createElement("canvas").getContext("2d");
levels[0].canvas.width = res["w"];
levels[0].canvas.height = res["h"];

levels[0].background =
[
    new Box({x:_VCENTER.x, y:res.h, w:res.w, h:128, o:{x:-0.5,y:-1}}, "black"),
    // new Box({x:_VCENTER.x, y:_VCENTER.y+256, w:128, h:32, o:{x:-0.5,y:-0.5}}, "green", _PLATFORM),
    // new Box({x:_VCENTER.x, y:512, w:128, h:32, o:{x:-0.5,y:-0.5}}, "green", _PLATFORM),
    new Box({x:_VCENTER.x, y:res.h-128, w:512, h:128, o:{x:-0.5,y:-1}}, "Red")
];
levels[0].boss =
[
    new Drone({x:_VCENTER.x+0.0000001, y:256, w:96, h:96, o:{x:-0.5,y:-0.5}}, _DroneIMG["drone"], _BLOCKALL, PLAYER)
]
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