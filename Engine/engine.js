let swordin = false;

function drawSword(dmg)
{
    display.drawImg(currentCtx,
        {
            x:PLAYER.sword.swordAura.t.x,
            y:PLAYER.sword.swordAura.t.y,
            w:PLAYER.sword.swordAura.t.w,
            h:PLAYER.sword.swordAura.peakH,
            o:PLAYER.sword.swordAura.t.o
        }
        , PLAYER.sword.swordAura.c, 0.8, PLAYER.sword.r);
    display.drawImg(currentCtx,PLAYER.sword.swordAura.t, PLAYER.sword.swordAura.c, 0.8, PLAYER.sword.r);
    display.drawImg(currentCtx,
    {
        x:PLAYER.sword.t.x,
        y:PLAYER.sword.t.y,
        w:PLAYER.sword.st.w,
        h:PLAYER.sword.st.h,
        o:PLAYER.sword.st.o
    }, PLAYER.sword.c, 1, PLAYER.sword.r);
    display.render();

    display.stacks += 12 * (dmg/500);
    shakeReset = Math.round(32 * (dmg/500));
}

function checkQueuedStop(engine)
{
    if (engine.stopQueued != 0)
    {
        if (swordin)
        {
            drawSword(engine.stopQueued);
            swordin = false;
        }
        else
        {
            display.stacks+=12;
            shakeReset = 32;
        }
        engine.stop();
        setTimeout(() => {
            engine.start();
        }, engine.stopQueued);
        
        engine.stopQueued = 0;
        return true;
    }
    return false;
}

function setFPS(delta, fpsDisplay, type = "UPDATE")
{
    fpsDisplay.word = [type+": "+(1000/delta).toFixed(2)];
}

class Engine
{
    constructor (fps, update, render)
    {
        this.time = 0;
        this.timeStamp = 0;
        this.timeStampR = 0;
        this.delta = 0;
        this.deltaR = 0;
        this.update = update;
        this.render = render;
        this.fps = fps;
        this.stopQueued = 0;

        this.run = (time) =>
        {
            this.time = time;
            this.delta = this.time - this.timeStamp;
            this.deltaR = this.time - this.timeStampR;

            if (this.deltaR >= Math.floor(1000 / this.fps))
            {
                this.update();
                if (checkQueuedStop(_ENGINE)) return;
                this.render();

                setFPS(this.delta, FPSDISPLAY, "UPDATE");
                setFPS(this.deltaR, FPSDISPLAYR, "RENDER");

                this.timeStampR = this.timeStamp = time;
            }
            else if (this.delta >= Math.floor(1000 / 60))
            {
                this.update();
                
                if (checkQueuedStop(_ENGINE)) return;

                setFPS(this.delta, FPSDISPLAY);
                
                this.timeStamp = time;
            }

            this.animationRequest = window.requestAnimationFrame(this.run);
        }
    }

    start()
    {
        this.animationRequest = window.requestAnimationFrame(this.run);
    }

    stop()
    {
        window.cancelAnimationFrame(this.animationRequest);
    }
}