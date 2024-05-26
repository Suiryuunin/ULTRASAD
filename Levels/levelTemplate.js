levels[1] = document.createElement("canvas").getContext("2d");
levels[1].canvas.width = res["w"];
levels[1].canvas.height = res["h"];

//Background
levels[1].BACKGROUND = document.createElement("canvas").getContext("2d");
levels[1].BACKGROUND.canvas.width = res.w;
levels[1].BACKGROUND.canvas.height = res.h;
levels[1].background =
[
];

levels[1].boss =
[
    // new Drone({x:_VCENTER.x+0.0000001, y:256, w:96, h:96, o:{x:-0.5,y:-0.5}}, _DroneIMG["drone"], _BLOCKALL, PLAYER)
    
];

// Foreground
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