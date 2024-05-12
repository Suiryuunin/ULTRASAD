const canvas = document.querySelector("canvas");

class Display
{
    "use strict";

    constructor(canvas)
    {

        this.display = canvas.getContext("2d");
        
        this.settings = document.createElement("canvas").getContext("2d");
        
        this.color = "black";
        this.font = "Times New Roman";
    }

    drawBackground(ctx, color = "black")
    {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    measureWordWidth(ctx, word, size = 16)
    {
        ctx.font = `${size}px ${this.font}`;
        return ctx.measureText(word)["width"];
    }

    drawWord(ctx, {word, x, y, offsetX = 0, offsetY = 0, border = true, size = 16, color = this.color, alpha = 1, linesMargin = 1})
    {
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1;

        ctx.font = `${size}px ${this.font}`;
        this.w = 0;
        for (let i = 0; i < word; i++)
        {
            this.w = Math.max(this.w, ctx.measureText(word[i])["width"]);
        }
        
        ctx.fillStyle = color;

        for (let i = 0; i < words; i++)
        {
            ctx.fillText(word[i], x + 5 + Math.floor(this.widths[i] * offsetX), (i + 1) * (linesMargin + 14) + y, this.w + 4);
        }

        if (border)
        {
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.rect(x + Math.floor(this.w * offsetX), y + offsetY, this.w + 8, size * words);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    drawImg(ctx, {x, y, w, h, o}, img, alpha = 1)
    {
        ctx.globalAlpha = alpha;
        if (o != undefined)
        {
          x += w * o.x;
          y += h * o.y;
        }
        ctx.drawImage(img, x, y, w, h);
    }

    drawRect(ctx, {x, y, w, h, o}, color = this.color, alpha = 1, content = "fill", thickness = 1)
    {
        ctx.globalAlpha = alpha;
        if (o != undefined)
        {
            x += w*o.x;
            y += h*o.y;
        }

        if (content.includes("border"))
        {
            ctx.lineWidth = thickness;
            ctx.strokeStyle = color;
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
            this.display.canvas.height = w * ratio;
            this.display.canvas.width = w;
        }
        else
        {
            this.display.canvas.height = h;
            this.display.canvas.width = h / ratio;
        }
    }

    render()
    {

        this.display.drawImage(currentCtx.canvas,
            0, 0,
            currentCtx.canvas.width, currentCtx.canvas.height,
            0, 0,
            this.display.canvas.width, this.display.canvas.height);

        this.color = this.brightness <= 25 ? "white" : "black";
    }
}