"use strict";

const resize = () =>
{
    display.resize(window.innerWidth, window.innerHeight, res.h/res.w);
    display.render();

};

const update = () =>
{
    // Background
    for (const element of currentCtx.background)
    {
        if (element.active)
        {
            element.update();
        }
    }

    for (const element of currentCtx.boss)
    {
        if (element.active)
        {
            element.update();
        }
    }
    
    // Player
    PLAYER.updateMovement();
    PLAYER.update();

    // Foreground
    for (const element of currentCtx.foreground)
    {
        if (element.active)
        {
            element.update();
        }
    }

    // Background
    let colliding = {l:false,r:false,t:false,b:false};
    for (const element of ALL)
    {
        if (element.active)
        {
            if (!colliding.l || !colliding.r || !colliding.t || !colliding.b)
            {
                colliding = element.updateCollision(colliding);
            }
            
            if (!element.boss)
            for (const bullet of currentCtx.boss[0].bullets)
                element.updateCollision({l:false,r:false,t:false,b:false}, "circle/rect", bullet);
        }
    }

    for (const bullet of currentCtx.boss[0].bullets)
    {
        if (PLAYER.updateCollision({l:false,r:false,t:false,b:false}, "circle/circle", bullet) && !PLAYER.shield)
            PLAYER.updateCollision({l:false,r:false,t:false,b:false}, "circle/rect", bullet);
    }

    PLAYER.lateUpdate();
};
const render = () =>
{
    // Background
    display.drawBackground(currentCtx);
    for (const element of currentCtx.background)
    {
        if (element.visible)
        {
            element.render();
        }
    }

    for (const element of currentCtx.boss)
    {
        if (element.visible)
        {
            element.render();
        }
    }

    // Player
    PLAYER.render();

    // Foreground
    for (const element of currentCtx.foreground)
    {
        if (element.visible)
        {
            element.render();
        }
    }

    for (const element of FOREGROUNDQUEUE)
    {
        element.render();
    }

    display.render();
};

const engine = new Engine(30, update, render);
const display = new Display(canvas);

engine.start();

addEventListener("resize", resize);

addEventListener("load", () => {resize();});