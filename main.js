"use strict";

const resize = () =>
{
    display.resize(window.innerWidth, window.innerHeight, res.h/res.w);
    display.render();

};

let _TRANSITIONING = false;
let transitionSteps = 4;
let transitionStep = transitionSteps;
let transitionMovement = 0;
let transitionDirection = 1;

let shakeReset = 16;
let shakeDuration = 16;

let bossCount = 0;

const update = () =>
{
    if (display.stacks > 0)
        shakeReset--;
    if (shakeReset == 0)
    {
        shakeReset = shakeDuration;
        display.stacks = 0;
    }

    if (!currentCtx.cleared)
    {
        bossCount = 0;
        for (const boss of currentCtx.boss)
        {
            if (!boss.dying)
                bossCount++;
        }
        if (bossCount == 0)
        {
            currentCtx.cleared = true;
            for (const door of currentCtx.doors)
            {
                door.active = false;
                ALL.splice(ALL.indexOf(door), 1);
            }
        }
    }

    if (!currentCtx.cleared && PLAYER.center.x > 128 && PLAYER.center.x < _VCENTER.x)
        for (const door of currentCtx.doors)
            door.active = true;

    if (_TRANSITIONING)
    {
        if (transitionStep > 0)
        {
            transitionMovement += (res.w/display.downscale)/transitionSteps*transitionDirection;
            transitionStep--;
            return;
        }
        transitionStep = transitionSteps;
        transitionMovement = 0;
        _TRANSITIONING = false;
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

    for (const element of POPUPQUEUE)
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

            if (PLAYER.sword.hitbox != undefined && PLAYER.sword.hitbox.active && PLAYER.sword.hitbox.isCollidingWith(element.t) && element.collision != _NOCOLLISION)
            {
                PLAYER.sword.hitbox.hitList.push(element);
                PLAYER.sword.hitbox.hitList = [...new Set(PLAYER.sword.hitbox.hitList)];
            }

            for (const blood of currentCtx.BLOOD)
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

        if (currentCtx.rockPile)
            for (const rockPile of currentCtx.rockPile)
            {
                rockPile.updateCollision({l:false,r:false,t:false,b:false}, "circle/rect", explosion);
            }
    }

    for (let i = 0; i < currentCtx.BLOOD.length; i++)
    {
        if (currentCtx.BLOOD[i].active)
            currentCtx.BLOOD[i].update();
        else
            currentCtx.BLOOD.splice(i, 1);
    }

    PLAYER.lateUpdate();

    for (const element of UI)
    {
        element.update();
    }


    if (PLAYER.center.x <= 0)
    {
        PLAYER.t.x = res.w-1;
        switchLevel(-1);
    }
    if (PLAYER.center.x >= res.w)
    {
        PLAYER.t.x = 1;
        switchLevel(1);
    }
};

























const render = () =>
{
    // Background
    display.drawBackground(currentCtx);

    for (const element of currentCtx.boss)
    {
        if (element.visible && element.dying)
        {
            element.render();
        }
    }
    
    for (const element of currentCtx.doors)
    {
        if (element.active)
        {
            element.render();
        }
    }

    currentCtx.drawImage(currentCtx.BACKGROUND.canvas,
        0,0,
        currentCtx.BACKGROUND.canvas.width, currentCtx.BACKGROUND.canvas.height,
        0,0,
        currentCtx.canvas.width, currentCtx.canvas.height);

    for (const element of currentCtx.boss)
    {
        if (element.visible && !element.dying)
        {
            element.render();
        }
    }

    // Player
    PLAYER.render();

    // Foreground
    currentCtx.drawImage(currentCtx.FOREGROUND.canvas,
        0,0,
        currentCtx.FOREGROUND.canvas.width, currentCtx.FOREGROUND.canvas.height,
        0,0,
        currentCtx.canvas.width, currentCtx.canvas.height);

    for (const blood of currentCtx.BLOOD)
    {
        blood.render();
    }

    for (const element of currentCtx.FOREGROUNDQUEUE)
    {
        element.render();
    }

    for (const element of explosions)
    {
        element.render();
    }

    for (const element of POPUPQUEUE)
    {
        element.render();
    }

    for (const element of UI)
    {
        element.render();
    }

    display.render();
};

const _ENGINE = new Engine(30, update, render);
_ENGINE.start();

addEventListener("resize", resize);

addEventListener("load", () => {resize();});