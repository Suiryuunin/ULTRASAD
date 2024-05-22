class Button extends Dynamic
{
    constructor(type, {x,y,w,h,o}, c, action = undefined, cc = undefined, cs = undefined, hc = undefined, hs = undefined, collision = _BLOCKALL)
    {
        super(type, {x,y,w,h,o}, c, collision);

        this.action = action;

        this.interactable = true;
        this.canHover = false;
        this.canClick = false;

        if (hc != undefined)
        {
            this.canHover = true;
            this.hc = hc;
            this.hs = hs;

            document.addEventListener("mousemove", (e) =>
            {
                const p = toCanvasCoords(e.clientX, e.clientY);
                if (!this.isOCollidingWith({x:p.x, y:p.y, w:0, h:0, o:{x:-0.5,y:-0.5}}))
                {
                    this.hovering = false;
                    this.c = this.oc;
                    this.scaleTo({w:this.ot.w, h:this.ot.h});
                }
                else if (!this.hovering && this.canHover)
                {
                    this.c = this.hc;
                    this.scaleBy(hs);
                    this.hovering = true;
                }
            });
        }

        if (cc != undefined)
        {
            this.canClick = true;
            this.cc = cc;
            this.cs = cs;

            document.addEventListener("mousedown", (e) =>
            {
                const p = toCanvasCoords(e.clientX, e.clientY);
                if (this.isCollidingWith({x:p.x, y:p.y, w:0, h:0, o:{x:-0.5,y:-0.5}}) && this.canClick)
                {
                    this.c = this.cc;
                    this.scaleBy(cs);
                }
            });

            document.addEventListener("mouseup", (e) =>
            {
                const p = toCanvasCoords(e.clientX, e.clientY);
                if (this.action != undefined && this.isOCollidingWith({x:p.x, y:p.y, w:0, h:0, o:{x:-0.5,y:-0.5}}))
                {
                    if (this.canClick || this.canHover)
                    {
                        this.c = this.oc;
                        this.scaleTo({w:this.ot.w, h:this.ot.h});
                        if (this.hovering)
                        {
                            this.c = this.hc;
                            this.scaleBy(hs);
                        }
                    }

                    this.action();
                }
            });
        }
        
    }
}

class HealthBar extends Dynamic
{
    constructor({x,y,w,h,o},target, c = "red", c2 = "#ff9438", c3 = "black", name = "", collision = _NOCOLLISION)
    {
        super("color", {x,y,w,h,o}, c, collision);
        this.target = target;
        this.initWidth = w;
        this.c2 = c2;
        this.c3 = c3;
        this.name = name
        this.ut =
        {
            x:this.t.x,
            y:this.t.y,
            w:this.initWidth,
            h:this.t.h,
            o:this.t.o
        };
        this.ht =
        {
            x:this.t.x + this.initWidth,
            y:this.t.y,
            w:0,
            h:this.t.h,
            o:{x:-1,y:this.t.o.y}
        };
    }

    update()
    {
        if (this.t.w < this.ut.w)
            this.ut.w = Math.abs(this.ut.w-this.t.w) < 1 ? this.t.w: (this.ut.w - ((this.ut.w-this.t.w)/20));
        
        if (this.t.w < this.initWidth*this.target.hp/this.target.maxHp)
            this.ut.w = this.initWidth*this.target.hp/this.target.maxHp < 0 ? 0 : this.initWidth*this.target.hp/this.target.maxHp;

        this.t.w = this.initWidth*this.target.hp/this.target.maxHp < 0 ? 0 : this.initWidth*this.target.hp/this.target.maxHp;

        if (this.target.hardDmg != undefined)
            this.ht.w = this.initWidth*this.target.hardDmg/this.target.maxHp;
    }
    render()
    {
        const shake = {x:this.target.hp <= 0 ? (Math.random()-0.5)*16 : 0,
            y:this.target.hp <= 0 ? (Math.random()-0.5)*16 : 0};
        
        display.drawRect(currentCtx, {x:this.ot.x+shake.x, y:this.ot.y+shake.y, w:this.ot.w, h:this.ot.h, o:this.ot.o}, "black", 1, "fill");
        display.drawRect(currentCtx, {x:this.ut.x+shake.x, y:this.ut.y+shake.y, w:this.ut.w, h:this.ut.h, o:this.ut.o}, this.c2, 1, "fill");
        display.drawRect(currentCtx, {x:this.t .x+shake.x, y:this.t .y+shake.y, w:this.t .w, h:this.t .h, o:this.t .o}, this.c, 1, "fill");
        display.drawRect(currentCtx, {x:this.ht.x+shake.x, y:this.ht.y+shake.y, w:this.ht.w, h:this.ht.h, o:this.ht.o}, "gray", 1, "fill");
        display.drawRect(currentCtx, {                  x:shake.y+this.t.x+this.ot.w*this.t.o.x+this.ot.w/2,    y:shake.x+this.t.y, w:this.ot.w+16,h:this.ot.h+16, o:{x:-0.5,y:-0.5}}, this.c3, 0.5, "border", 16);
        display.drawWord(currentCtx, {word:[this.name], x:shake.y+this.t.x+this.ot.w*this.t.o.x+this.ot.w/2,  y:shake.x+this.t.y, o:{x:-0.5,y:-0.5}, border:false, size:this.t.h, color:"white"});
    }
}