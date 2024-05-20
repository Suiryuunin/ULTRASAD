function drawSword()
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
                if (this.stopQueued != 0)
                {
                    drawSword();
                    this.stop();
                    setTimeout(() => {
                        this.start();
                    }, this.stopQueued);
                    
                    this.stopQueued = 0;
                    return;
                }
                this.render();

                this.timeStampR = this.timeStamp = time;
            }
            else if (this.delta >= Math.floor(1000 / 60))
            {
                this.update();
                if (this.stopQueued != 0)
                {
                    drawSword();
                    this.stop();
                    setTimeout(() => {
                        this.start();
                    }, this.stopQueued);

                    this.stopQueued = 0;
                    return;
                }

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