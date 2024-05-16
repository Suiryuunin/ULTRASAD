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
    for (const element of currentCtx.background)
    {
        if (element.active)
        {
            if (!colliding.l || !colliding.r || !colliding.t || !colliding.b)
                colliding = element.updateCollision(colliding);
            else
                break;
        }
    }

    // Foreground
    for (const element of currentCtx.foreground)
    {
        if (element.active)
        {
            if (!colliding.l || !colliding.r || !colliding.t || !colliding.b)
                colliding = element.updateCollision(colliding);
            else
                break;
        }
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

    display.render();
};

const engine = new Engine(30, update, render);
const display = new Display(canvas);

engine.start();

addEventListener("resize", resize);

addEventListener("load", () => {resize();});