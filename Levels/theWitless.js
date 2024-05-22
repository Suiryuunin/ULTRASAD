const THEWITLESS = document.createElement("canvas").getContext("2d");

THEWITLESS.background =
[
    new Box({x:0,y:0,w:res.w,h:res.h,o:_NOOFFSET}, "lightgray", _NOCOLLISION),
    new Box({x:_VCENTER.x, y:res.h, w:res.w, h:128, o:{x:-0.5,y:-1}}, "black"),
    new Box({x:_VCENTER.x, y:_VCENTER.y+256, w:128, h:32, o:{x:-0.5,y:-0.5}}, "green", _PLATFORM),
    new Box({x:512, y:res.h-128, w:96, h:128, o:{x:-0.5,y:-1}}, "Red")
];
THEWITLESS.boss =
[
]
THEWITLESS.foreground =
[
];

THEWITLESS.switch = function()
{
    currentCtx = this;

    ALL = [];
    ALL.push(...currentCtx.background, ...currentCtx.boss, ...currentCtx.foreground);
    currentCtx.canvas.width = res["w"];
    currentCtx.canvas.height = res["h"];
}

window.addEventListener("click", () => THEWITLESS.switch())