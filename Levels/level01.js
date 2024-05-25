levels[1] = document.createElement("canvas").getContext("2d");
levels[1].canvas.width = res["w"];
levels[1].canvas.height = res["h"];

levels[1].background =
[
    new Box({x:0,y:0,w:res.w,h:res.h,o:_NOOFFSET}, "lightgray", _NOCOLLISION),
    new Box({x:_VCENTER.x, y:res.h, w:res.w, h:128, o:{x:-0.5,y:-1}}, "black"),
    new Box({x:_VCENTER.x, y:_VCENTER.y+256, w:128, h:32, o:{x:-0.5,y:-0.5}}, "green", _PLATFORM),
    new Box({x:512, y:res.h-128, w:96, h:128, o:{x:-0.5,y:-1}}, "Red")
];
levels[1].boss =
[
    new Maurice({x:_VCENTER.x+0.0000001, y:256, w:128, h:128, o:{x:-0.5,y:-0.5}}, _MauriceIMG["maurice"], _BLOCKALL, PLAYER)
]
levels[1].foreground =
[
];

levels[1].BLOOD = [];
levels[1].BLOODCTX = document.createElement("canvas").getContext("2d");
levels[1].BLOODCTX.canvas.width = res.w;
levels[1].BLOODCTX.canvas.height = res.h;
levels[1].FOREGROUNDQUEUE = [];