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
                if (!this.isOCollidingWith({x:p.x, y:p.y, w:0, h:0}))
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
                if (this.isCollidingWith({x:p.x, y:p.y, w:0, h:0}) && this.canClick)
                {
                    this.c = this.cc;
                    this.scaleBy(cs);
                }
            });

            document.addEventListener("mouseup", (e) =>
            {
                const p = toCanvasCoords(e.clientX, e.clientY);
                if (this.action != undefined && this.isOCollidingWith({x:p.x, y:p.y, w:0, h:0}))
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
    constructor({x,y,w,h,o},target, c = "red", c2 = "#ff9438", c3 = "black", collision = _NOCOLLISION)
    {
        super("color", {x,y,w,h,o}, c, collision);
        this.target = target;
        this.initWidth = w;
        this.initHp = target.hp;
        this.c2 = c2;
        this.c3 = c3;
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
        
        if (this.t.w < this.initWidth*this.target.hp/this.initHp)
            this.ut.w = this.initWidth*this.target.hp/this.initHp < 0 ? 0 : this.initWidth*this.target.hp/this.initHp;

        this.t.w = this.initWidth*this.target.hp/this.initHp < 0 ? 0 : this.initWidth*this.target.hp/this.initHp;

        if (this.target.hardDmg != undefined)
            this.ht.w = this.initWidth*this.target.hardDmg/this.initHp;
    }
    render()
    {
        display.drawRect(currentCtx, this.ut, this.c2, 1, "fill");
        display.drawRect(currentCtx, this.t, this.c, 1, "fill");
        display.drawRect(currentCtx, this.ht, "gray", 1, "fill");
        display.drawRect(currentCtx, this.ot, this.c3, 1, "border", 8);
    }
}