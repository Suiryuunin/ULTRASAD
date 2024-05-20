"use strict";

const resize = () =>
{
    display.resize(window.innerWidth, window.innerHeight, res.h/res.w);
    display.render();

};

let shakeReset = 16;
let shakeDuration = 16;
const update = () =>
{
    if (display.stacks > 0)
        shakeReset--;
    if (shakeReset == 0)
    {
        shakeReset = shakeDuration;
        display.stacks = 0;
    }
    
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

    for (const element of explosions)
    {
        element.update();
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
            {
                for (const bullet of currentCtx.boss[0].bullets)
                    element.updateCollision({l:false,r:false,t:false,b:false}, "circle/rect", bullet);
            }

            for (const bullet of PLAYER.bullets)
                if (!bullet.trapped)
                    element.updateCollision({l:false,r:false,t:false,b:false}, "circle/rect", bullet);

            if (PLAYER.sword.hitbox.active && PLAYER.sword.hitbox.isCollidingWith(element.t) && element.collision != _NOCOLLISION)
            {
                PLAYER.sword.hitbox.hitList.push(element);
                PLAYER.sword.hitbox.hitList = [...new Set(PLAYER.sword.hitbox.hitList)];
            }
        }
    }

    for (const bullet of currentCtx.boss[0].bullets)
    {
        for (const pbullet of PLAYER.bullets)
        {
            if (pbullet.updateCollision({l:false,r:false,t:false,b:false}, "circle/circle", bullet)) break;
        }
        if (!PLAYER.updateCollision({l:false,r:false,t:false,b:false}, "circle/circle", bullet) && !PLAYER.shield)
            PLAYER.updateCollision({l:false,r:false,t:false,b:false}, "circle/rect", bullet);
    }

    for (const explosion of explosions)
    {
        PLAYER.updateCollision({l:false,r:false,t:false,b:false}, "circle/rect", explosion);
        currentCtx.boss[0].updateCollision({l:false,r:false,t:false,b:false}, "circle/rect", explosion);
    }

    PLAYER.lateUpdate();

    for (const element of UI)
    {
        element.update();
    }
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

    for (const element of explosions)
    {
        element.render();
    }

    for (const element of UI)
    {
        element.render();
    }

    display.render();
};

const engine = new Engine(60, update, render);
const display = new Display(canvas);

engine.start();

addEventListener("resize", resize);

addEventListener("load", () => {resize();});