const currentCtx = document.createElement("canvas").getContext("2d");

const bg = new Image();
bg.src = "Assets/Textures/bg1080p.jpg";

currentCtx.background =
[
    new Box({x:0,y:0,w:res.w,h:res.h,o:_NOOFFSET}, "lightgray", _NOCOLLISION),
    new Box({x:_VCENTER.x, y:res.h, w:res.w, h:128, o:{x:-0.5,y:-1}}, "black"),
    new Box({x:_VCENTER.x, y:_VCENTER.y+256, w:128, h:32, o:{x:-0.5,y:-0.5}}, "green", _PLATFORM),
    new Box({x:_VCENTER.x+512, y:res.h-128, w:96, h:128, o:{x:-0.5,y:-1}}, "Red")
];
currentCtx.boss =
[
    new Maurice({x:_VCENTER.x, y:256, w:128, h:128, o:{x:-0.5,y:-0.5}}, playerIMG, _BLOCKALL, PLAYER)
]
currentCtx.foreground =
[
    new Box({x:_VCENTER.x+128, y:_VCENTER.y+256, w:128, h:32, o:{x:-0.5,y:-0.5}}, "hotpink", _PLATFORM),
];

let DYNAMIC =
[
    PLAYER
];

let ALL = [];
ALL.push(...currentCtx.background, ...currentCtx.boss, ...currentCtx.foreground);

let UI =
[
    new HealthBar({x:256, y:64, w:res.w-512, h:64, o:{x:0, y:-0.5}}, currentCtx.boss[0]),
    new HealthBar({x:64, y:res.h-64, w:512, h:64, o:{x:0, y:-0.5}}, PLAYER, "red", "#ff9438", "white")
];

function reset()
{
    FOREGROUNDQUEUE = [];
    PLAYER = new Player("img", {x:_VCENTER.x,y:_VCENTER.y,w:64,h:128,o:_CENTEROFFSET},playerIMG);
    PLAYER.name = "player";

    currentCtx.background =
    [
        new Box({x:0,y:0,w:res.w,h:res.h,o:_NOOFFSET}, "lightgray", _NOCOLLISION),
        new Box({x:_VCENTER.x, y:res.h, w:res.w, h:128, o:{x:-0.5,y:-1}}, "black"),
        new Box({x:_VCENTER.x, y:_VCENTER.y+256, w:128, h:32, o:{x:-0.5,y:-0.5}}, "green", _PLATFORM),
        new Box({x:_VCENTER.x+512, y:res.h-128, w:96, h:128, o:{x:-0.5,y:-1}}, "Red")
    ];
    currentCtx.boss =
    [
        new Maurice({x:_VCENTER.x, y:256, w:128, h:128, o:{x:-0.5,y:-0.5}}, playerIMG, _BLOCKALL, PLAYER)
    ]
    currentCtx.foreground =
    [
        new Box({x:_VCENTER.x+128, y:_VCENTER.y+256, w:128, h:32, o:{x:-0.5,y:-0.5}}, "hotpink", _PLATFORM),
    ];

    DYNAMIC =
    [
        PLAYER
    ];

    ALL = [];
    ALL.push(...currentCtx.background, ...currentCtx.boss, ...currentCtx.foreground);

    UI =
    [
        new HealthBar({x:256, y:64, w:res.w-512, h:64, o:{x:0, y:-0.5}}, currentCtx.boss[0]),
        new HealthBar({x:64, y:res.h-64, w:512, h:64, o:{x:0, y:-0.5}}, PLAYER, "red", "#ff9438", "white")
    ];
}


currentCtx.canvas.width = res["w"];
currentCtx.canvas.height = res["h"];