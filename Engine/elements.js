class Rect
{
    constructor(type = "none", {x,y,w,h,o}, c, collision = _BLOCKALL, initFrame = 0)
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

        this.flip = {x:1,y:1};
        this.r = 0;
        this.alpha = 1;

        if (this.type == "ani")
        {
            this.frameSet = [];
            for (const f of this.c)
            {
                const TEMPIMG = new Image();
                TEMPIMG.src = f;
                this.frameSet.push(TEMPIMG);
            }
            this.frame = initFrame;
        }
    }

    updateFrameSet(frames)
    {
        this.frameSet = [];

        for (const f of frames)
        {
            const TEMPIMG = new Image();
            TEMPIMG.src = f;
            this.frameSet.push(f);
        }
        this.frame = 0;
    }
    
    checkCollision({l,r,t,b}, e)
    {
        if (this.collision.r && !l)
            l = e.collideLeft(this.t);
        if (this.collision.l && !r)
            r = e.collideRight(this.t);
        if (this.collision.b && !t)
            t = e.collideTop(this.t);
        if (this.collision.t && !b)
            b = e.collideBottom(this.t);

        return {l:l,r:r,t:t,b:b};
    }

    checkCRCollision(e)
    {
        if (this.collision != _NOCOLLISION)
        return e.circleRect(this.t);
    }

    updateCollision({l,r,t,b}, type = "rect/rect", exception = undefined)
    {
        if (type == "rect/rect")
        {
            if (exception != undefined)
            {
                return this.checkCollision({l,r,t,b}, exception);
            }
            return this.checkCollision({l,r,t,b}, PLAYER);
        }
        if (type == "circle/rect")
        {
            if (exception != undefined)
            {
                return this.checkCRCollision(exception);
            }
            return this.checkCRCollision(PLAYER);
        }
    }

    update()
    {
        if (this.updateMore != undefined)
            this.updateMore();
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
                display.drawImg(currentCtx, this.t, this.c, this.alpha, this.r, this.flip.x, this.flip.y);
                break;
            }

            case "ani":
            {
                display.drawImg(currentCtx, this.t, this.frameSet[this.frame], this.alpha, this.r, this.flip.x, this.flip.y);
                this.frame = (this.frame+1)%this.frameSet.length;
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
    moveBy({x,y}, d=1)
    {
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

        if (this.updateMore != undefined)
            this.updateMore();
    }

    circleRect({x,y,w,h,o}) {

        const rx = x + w * o.x, ry = y + h * o.y;

        const cx = this.center.x, cy = this.center.y;
        
        let testX = cx;
        let testY = cy;
      
        // which edge is closest?
        if (cx < rx)        {testX = rx;  }    // test left edge
        else if (cx > rx+w) {testX = rx+w;}   // right edge
        if (cy < ry)        {testY = ry;  }    // top edge
        else if (cy > ry+h) {testY = ry+h;}   // bottom edge
      
        // get distance from closest edges
        const distX = cx-testX;
        const distY = cy-testY;
        const distance = Math.sqrt(distX**2+distY**2);
      
        // if the distance is less than the radius, collision!
        if (distance <= this.t.w/2)
        {
            if (this.circleRectA != undefined)
                this.circleRectA({x:distX, y:distY}, distance);
            return true;
        }
        return false;
    }

    collideTop({x,y,w,h,o})
    {
        const _o = this.t.h * this.t.o.y;
        const _x = this.t.x + this.t.w * this.t.o.x, _y = this.t.y + _o;
        const oldy = this.oldt.y + _o;
        const __x = x + w * o.x, __y = y + h * o.y;

        if (_x+this.t.w >= __x   &&
            _x          <= __x+w &&
            _y          <= __y+h &&
            oldy        >= __y+h)
        {
            if (this.collideTopA != undefined)
                this.collideTopA({x,y,w,h,o});
            return true;
        }
        
        return false;
    }
    collideBottom({x,y,w,h,o})
    {
        const _o = this.t.h * this.t.o.y;
        const _x = this.t.x + this.t.w * this.t.o.x, _y = this.t.y + _o;
        const oldy = this.oldt.y + _o;
        const __x = x + w * o.x, __y = y + h * o.y;
        
        if (_x+this.t.w   >= __x   &&
            _x            <= __x+w &&
            _y+this.t.h   >= __y   &&
            oldy+this.t.h <= __y)
        {
            if (this.collideBottomA != undefined)
                this.collideBottomA({x,y,w,h,o});
            return true;
        }
        
        if (this.grounded != undefined)
            this.grounded = false;
        return false;
    }
    collideLeft({x,y,w,h,o})
    {
        const _o = this.t.w * this.t.o.x;
        const _x = this.t.x + _o, _y = this.t.y + this.t.h * this.t.o.y;
        const oldx = this.oldt.x + _o;
        const __x = x + w * o.x, __y = y + h * o.y;

        if (_x          <= __x+w &&
            oldx        >= __x+w &&
            _y+this.t.h >= __y   &&
            _y          <= __y+h)
        {
            if (this.collideLeftA != undefined)
                this.collideLeftA({x,y,w,h,o});
            return true;
        }
        
        return false;
    }
    collideRight({x,y,w,h,o})
    {
        const _o = this.t.w * this.t.o.x;
        const _x = this.t.x + _o, _y = this.t.y + this.t.h * this.t.o.y;
        const oldx = this.oldt.x + _o;
        const __x = x + w * o.x, __y = y + h * o.y;

        if (_x+this.t.w   >= __x   &&
            oldx+this.t.w <= __x   &&
            _y+this.t.h   >= __y   &&
            _y            <= __y+h)
        {
            if (this.collideRightA != undefined)
                this.collideRightA({x,y,w,h,o});
            return true;
        }
        
        return false;
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