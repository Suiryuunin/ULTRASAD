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