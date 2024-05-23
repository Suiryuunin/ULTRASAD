"use strict";

const resize = () =>
{
    display.resize(window.innerWidth, window.innerHeight, res.h/res.w);
    display.render();

};

let shakeReset = 16;
let shakeDuration = 16;

let musicReset = 16;
let musicDuration = 16;
const update = () =>
{
    if (display.stacks > 0)
        shakeReset--;
    if (shakeReset == 0)
    {
        shakeReset = shakeDuration;
        display.stacks = 0;
    }

    for (let i = 0; i < BLOODGENERATORS.length; i++)
    {
        if (BLOODGENERATORS[i].active)
            BLOODGENERATORS[i].update();
        else
            BLOODGENERATORS.splice(i, 1);
    }

    for (let i = 0; i < currentCtx.boss.length; i++)
    {
        if (currentCtx.boss[i].dead)
        {
            ALL.splice(ALL.indexOf(currentCtx.boss[i]), 1);
            currentCtx.boss.splice(i, 1);
        }
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

    // Collisions

    for (const boss of currentCtx.boss)
    {
        boss.groundedThisFrame = false;
    }

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
                for (const boss of currentCtx.boss)
                {
                    for (const bullet of boss.bullets)
                        element.updateCollision({l:false,r:false,t:false,b:false}, "circle/rect", bullet);

                    if (boss.dying && !boss.groundedThisFrame)
                    {
                        element.updateCollision({l:false,r:false,t:false,b:false}, "rect/rect", boss);
                    }
                }
            }

            for (const bullet of PLAYER.bullets)
                if (!bullet.trapped)
                    element.updateCollision({l:false,r:false,t:false,b:false}, "circle/rect", bullet);

            if (PLAYER.sword.hitbox.active && PLAYER.sword.hitbox.isCollidingWith(element.t) && element.collision != _NOCOLLISION)
            {
                PLAYER.sword.hitbox.hitList.push(element);
                PLAYER.sword.hitbox.hitList = [...new Set(PLAYER.sword.hitbox.hitList)];
            }

            for (const blood of BLOOD)
                element.updateCollision({l:false,r:false,t:false,b:false}, "rect/rect", blood);
        }
    }
        

    for (const boss of currentCtx.boss)
    {
        for (const bullet of boss.bullets)
        {
            for (const pbullet of PLAYER.bullets)
            {
                if (pbullet.updateCollision({l:false,r:false,t:false,b:false}, "circle/circle", bullet)) break;
            }
            if (!PLAYER.updateCollision({l:false,r:false,t:false,b:false}, "circle/circle", bullet) && !PLAYER.shield)
                PLAYER.updateCollision({l:false,r:false,t:false,b:false}, "circle/rect", bullet);
        }
    }
    

    for (const explosion of explosions)
    {
        PLAYER.updateCollision({l:false,r:false,t:false,b:false}, "circle/rect", explosion);
        for (const boss of currentCtx.boss)
            boss.updateCollision({l:false,r:false,t:false,b:false}, "circle/rect", explosion);
    }

    for (let i = 0; i < BLOOD.length; i++)
    {
        if (BLOOD[i].active)
            BLOOD[i].update();
        else
            BLOOD.splice(i, 1);
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

    for (const blood of BLOOD)
    {
        blood.render();
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

const engine = new Engine(30, update, render);
const display = new Display(canvas);

engine.start();

addEventListener("resize", resize);

addEventListener("load", () => {resize();});