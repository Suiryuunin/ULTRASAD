class Rect
{
    constructor(type = "none", {x,y,w,h,o}, c, collision = _BLOCKALL)
    {
        this.type = type;
        this.name = "nameless";
        this.t = {x:x,y:y,w:w,h:h,o:o};
        this.ot = {x:x,y:y,w:w,h:h,o:o};
        this.c = c;
        this.oc = c;
        this.hovering = false;
        this.visible = true;
        this.active = true;
        this.collision = collision;
    }

    updateCollision({l,r,t,b})
    {
        if (this.collision.r && !l)
            t = PLAYER.collideLeft(this.t);
        if (this.collision.l && !r)
            t = PLAYER.collideRight(this.t);
        if (this.collision.b && !t)
            t = PLAYER.collideTop(this.t);
        if (this.collision.t && !b)
            b = PLAYER.collideBottom(this.t);

        return {l:l,r:r,t:t,b:b};
    }

    update()
    {

    }

    render()
    {
        switch(this.type)
        {
            case "color":
            {
                display.drawRect(currentCtx, this.t, this.c);
                break;
            }

            case "img":
            {
                display.drawImg(currentCtx, this.t, this.c);
                break;
            }

            default:
                console.log("INVALID TYPE!");
        }
        if (this.renderMore != undefined)
            this.renderMore();
    }

    isCollidingWith({x,y,w,h,o})
    {
        const _x = this.t.x+this.t.w*this.t.o.x;
        const _y = this.t.y+this.t.h*this.t.o.y;
        const __x = x + w * o.x;
        const __y = y + h * o.y;
        return (
            _x+this.t.w >= __x &&
            _x <= __x+w &&
            _y+this.t.h >= __y &&
            _y <= __y+h
        );
    }

    isOCollidingWith({x,y,w,h,o})
    {
        const _x = this.ot.x+this.ot.w*this.ot.o.x;
        const _y = this.ot.y+this.ot.h*this.ot.o.y;
        const __x = x + w * o.x;
        const __y = y + h * o.y;
        return (
            _x+this.ot.w >= __x &&
            _x <= __x+w &&
            _y+this.ot.h >= __y &&
            _y <= __y+h
        );
    }
}

class Box extends Rect
{
    constructor({x,y,w,h,o}, c, collision = _BLOCKALL)
    {
        super("color", {x,y,w,h,o}, c, collision);
    }
}

class Img extends Rect
{
    constructor({x,y,w,h,o}, c, collision = _BLOCKALL)
    {
        super("img", {x,y,w,h,o}, c, collision);
    }
}

class Dynamic extends Rect
{
    constructor(type, {x,y,w,h,o}, c, collision = _BLOCKALL)
    {
        super(type, {x,y,w,h,o}, c, collision)
        
        this.dynamic = true;
        this.direction = {x:0,y:0};
        this.v = {x:0, y:0};
        this.oldt = {};
    }

    setOldTransform()
    {
        this.oldt.x = this.t.x;
        this.oldt.y = this.t.y;
        this.oldt.w = this.t.w;
        this.oldt.h = this.t.h;
        this.oldt.o = this.t.o;
    }

    moveTo({x,y})
    {
        this.t.x = x;
        this.t.y = y;
    }
    moveBy({x,y}, d)
    {
        console.log(x)
        this.t.x += x*d;
        this.t.y += y*d;
    }
    moveTowards({x,y}, d)
    {
        this.t.x += Math.round((x-this.t.x)*d);
        this.t.y += Math.round((y-this.t.y)*d);
    }
    setDirectionTo({x,y})
    {
        x -= this.t.x;
        y -= this.t.y;
        const m = Math.sqrt(x**2+y**2);
        this.direction = {x:x/m, y:y/m};
    }

    translateBy({x,y})
    {
        this.t.x += x;
        this.t.y += y;
    }

    scaleTo({w,h})
    {
        this.t.w = w;
        this.t.h = h;
    }

    scaleBy(s)
    {
        this.t.w *= s;
        this.t.h *= s;
    }

    update()
    {
        this.setOldTransform();
        
        this.t.y -= this.v.y;
        this.t.x += this.v.x;
    }
}

class Physics extends Dynamic
{
    constructor(type, {x,y,w,h,o}, c, collision = _BLOCKALL)
    {
        super(type, {x,y,w,h,o}, c, collision)

        this.maxV = {x:12, y: Infinity};
        this.grounded = false;
        this.gravityMultiplier = 1;
    }

    update()
    {
        this.setOldTransform();
        if (!this.grounded)
            this.v.y += _GRAVITY*this.gravityMultiplier;
        this.t.y -= this.v.y;
        this.t.x += this.v.x;
    }
}