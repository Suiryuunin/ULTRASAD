const currentCtx = document.createElement("canvas").getContext("2d");

const bg = new Image();
bg.src = "Assets/Textures/bg1080p.jpg";

currentCtx.elements =
[
    PLAYER,
    new Img({x:0,y:0,w:res.w,h:res.h,o:_NOOFFSET}, bg),
    // new Button("color", {x:_VCENTER.x,y:_VCENTER.y,w:128,h:128,o:_CENTEROFFSET}, "black", ()=>{}, "black", 0.9, "black", 1.1),
];
currentCtx.elements[0].name = "player";
delete PLAYER;

currentCtx.canvas.width = res["w"];
currentCtx.canvas.height = res["h"];