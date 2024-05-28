const canvas = document.querySelector("canvas");

class Display
{
    "use strict";

    constructor(canvas)
    {

        this.display = canvas.getContext("2d");
        this.canvas = canvas;
        
        this.settings = document.createElement("canvas").getContext("2d");
        
        this.color = "black";
        this.font = "VCR_OSD";
        this.shakeStr = 8;
        this.stacks = 0;
        this.camShake = 0;
        this.downscale = 1;

        addEventListener("keydown", (e) =>
        {
            switch(e.code)
            {
                case "BracketLeft":
                    this.downscale--;
                    if (this.downscale < 1)
                        this.downscale = 1;
                    this.resize(window.innerWidth, window.innerHeight, res.h/res.w);
                    this.render();
                    break;
                case "BracketRight":
                    this.downscale++;
                    this.resize(window.innerWidth, window.innerHeight, res.h/res.w);
                    this.render();
                    break;
            }
        });
    }

    drawBackground(ctx, color = this.color)
    {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    measureWordWidth(ctx, word, size = 16)
    {
        ctx.font = `${size}px ${this.font}`;
        return ctx.measureText(word)["width"];
    }

    drawWord(ctx, {word, x, y, o = {x:0,y:0}, border = true, size = 16, color = this.color, alpha = 1, linesMargin = 1})
    {
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1;

        ctx.font = `${size}px ${this.font}`;
        let w = 0;
        let widths = [];
        for (let i = 0; i < word.length; i++)
        {
            w = Math.max(w, widths[i] = ctx.measureText(word[i])["width"]);
        }
        
        ctx.fillStyle = color;

        for (let i = 0; i < word.length; i++)
        {
            ctx.fillText(word[i], x + widths[i] * o.x, i*linesMargin + y - size*o.y/1.5, w);
        }

        if (border)
        {
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.rect(x + Math.floor(w * o.x), y + o.y, w + 8, size * word.length);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    drawImg(ctx, {x, y, w, h, o}, img, alpha = 1, r = 0, sx=1,sy=1)
    {
        if (alpha == 0) return;

        ctx.globalAlpha = alpha;
        if (o != undefined && r == 0 && sx == 1 && sy == 1)
        {
            x += w * o.x;
            y += h * o.y;
            
            ctx.drawImage(img, x, y, w, h);
            return;
        }
        
        ctx.save();

        if ((sx != 1 || sy != 1) && r != 0)
        {
            ctx.translate(x, y);
            ctx.rotate(r * Math.PI / 180);
            ctx.scale(sx,sy);
            
        }
        else
        {
            if (sx != 1 || sy != 1)
            {
                ctx.translate(x, y);
                ctx.scale(sx,sy);
            }

            if (r != 0)
            {
                ctx.translate(x, y);
                ctx.rotate(r * Math.PI / 180);
            }
        }

        ctx.drawImage(img, w * o.x, h * o.y, w, h);

        // restore the context to its untranslated/unrotated state
        ctx.restore();
    }

    drawRect(ctx, {x, y, w, h, o}, color = this.color, alpha = 1, content = "fill", thickness = 1, color2)
    {
        if (alpha == 0) return;

        ctx.globalAlpha = alpha;
        if (o != undefined)
        {
            x += w*o.x;
            y += h*o.y;
        }

        if (content.includes("border"))
        {
            ctx.lineWidth = thickness;
            ctx.strokeStyle = color2 == undefined ? color : color2;
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.stroke();
        }
        
        if (content.includes("fill"))
        {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
        }
        ctx.globalAlpha = 1;
    }

    resize(w, h, ratio)
    {
        if (h / w > ratio)
        {
            this.display.canvas.height = Math.ceil(w * ratio/this.downscale);
            this.display.canvas.width =  Math.ceil(w/this.downscale);
        }
        else
        {
            this.display.canvas.height = Math.ceil(h/this.downscale);
            this.display.canvas.width =  Math.ceil(h / ratio/this.downscale);
        }
        this.canvas.style.transform = "translate(-50%, -50%)scale("+this.downscale+"00%)";
    }

    render()
    {
        this.display.imageSmoothingEnabled = false;

        const shakePos =
        {
            x: (Math.random()-0.5)*this.stacks+Math.round((Math.random()-0.5)*this.shakeStr*this.camShake)/this.downscale,
            y: (Math.random()-0.5)*this.stacks+Math.round((Math.random()-0.5)*this.shakeStr*this.camShake)/this.downscale
        }

        if (Math.abs(shakePos.x) > 8/this.downscale*2)
            shakePos.x = Math.sign(shakePos.x)*8/this.downscale**2;

        if (Math.abs(shakePos.y) > 8/this.downscale*2)
            shakePos.y = Math.sign(shakePos.y)*8/this.downscale**2;

        if (_TRANSITIONING)
        {
            this.display.drawImage(prevCtx.canvas,
               transitionMovement,0,
                prevCtx.canvas.width, prevCtx.canvas.height,
                shakePos.x, shakePos.y,
                this.display.canvas.width, this.display.canvas.height);
            
            this.display.drawImage(prevCtx.BLOODCTX.canvas,
               transitionMovement,0,
                prevCtx.BLOODCTX.canvas.width, prevCtx.BLOODCTX.canvas.height,
                shakePos.x, shakePos.y,
                this.display.canvas.width, this.display.canvas.height);    
        }
        
        this.display.drawImage(currentCtx.canvas,
            !_TRANSITIONING? 0 : transitionMovement + (transitionDirection < 0 ? res.w : -res.w), !_TRANSITIONINGY? 0 : transitionMovement + (transitionDirection < 0 ? res.h : -res.h),
            currentCtx.canvas.width, currentCtx.canvas.height,
            shakePos.x, shakePos.y,
            this.display.canvas.width, this.display.canvas.height);
        
        this.display.drawImage(currentCtx.BLOODCTX.canvas,
            !_TRANSITIONING? 0 : transitionMovement + (transitionDirection < 0 ? res.w : -res.w), !_TRANSITIONINGY? 0 : transitionMovement + (transitionDirection < 0 ? res.h : -res.h),
            currentCtx.BLOODCTX.canvas.width, currentCtx.BLOODCTX.canvas.height,
            shakePos.x, shakePos.y,
            this.display.canvas.width, this.display.canvas.height);

        if (currentCtx.dark)
        {
            DARKCTX.globalCompositeOperation = 'source-over';
            DARKCTX.fillStyle = `rgba(0,0,0,1)`;
            DARKCTX.fillRect(0, 0, res.w, res.h);
            
            addLight(DARKCTX, PLAYER.center.x,PLAYER.center.y, 0,PLAYER.center.x,PLAYER.center.y, 256);

            DARKCTX.globalCompositeOperation = 'source-over';
            FPSDISPLAY.render(DARKCTX);
            FPSDISPLAYR.render(DARKCTX);

            this.display.drawImage(DARKCTX.canvas,
                0, 0,
                DARKCTX.canvas.width, DARKCTX.canvas.height,
                shakePos.x, shakePos.y,
                this.display.canvas.width, this.display.canvas.height);
        }
    }
}