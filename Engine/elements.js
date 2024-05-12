class Rect
{
    constructor(type = "none", {x,y,w,h,o}, c, collision = "BLOCKALL")
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
        if (this.collision == "BLOCKALL")
        {
            if (!l)
                t = PLAYER.collideLeft(this.t);
            if (!r)
                t = PLAYER.collideRight(this.t);
            if (!t)
                t = PLAYER.collideTop(this.t);
            if (!b)
                b = PLAYER.collideBottom(this.t);
        }
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
    constructor({x,y,w,h,o}, c, collision = "BLOCKALL")
    {
        super("color", {x,y,w,h,o}, c, collision);
    }
}

class Img extends Rect
{
    constructor({x,y,w,h,o}, c, collision = "BLOCKALL")
    {
        super("img", {x,y,w,h,o}, c, collision);
    }
}

class Dynamic extends Rect
{
    constructor(type, {x,y,w,h,o}, c, collision = "BLOCKALL")
    {
        super(type, {x,y,w,h,o}, c, collision)
        
        this.dynamic = true;
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
}

class Physics extends Dynamic
{
    constructor(type, {x,y,w,h,o}, c, collision = "BLOCKALL")
    {
        super(type, {x,y,w,h,o}, c, collision)

        this.v = {x:0, y:0};
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
        if (this.collision == "BLOCKALL")
        {
            this.isOCollidingWith(PLAYER.t)
        }
    }
}

class Button extends Dynamic
{
    constructor(type, {x,y,w,h,o}, c, action = undefined, cc = undefined, cs = undefined, hc = undefined, hs = undefined, collision = "BLOCKALL")
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


  ////////////
 // PLAYER //
////////////

class Player extends Physics
{
    constructor(type = "img", {x,y,w,h,o}, c)
    {
        super(type, {x,y,w,h,o}, c);

        this.collision = "ACTOR";
        this.player = true;
        
        // Movements
        this.direction = 0;

        this.walkingSpeed = 4;
        this.runningSpeed = 6;
        this.sprintSpeed = 8;
        this.airControl = 0.2;

        this.jumpStrength = 24;
        this.jumpSteps = 5;
        this.jumpStepsLeft = this.jumpSteps;
        this.jumpCounter = this.jumpSteps;
        this.jumping = false;

        this.maxV.x = 8;
        this.acceleration = 2;
        this.speed = this.acceleration;

        this.axisMapping = {
            "KeyA":-1,
            "KeyD": 1,
            "KeyK": 0,
        }
        this.keys = {
            "KeyA": false,
            "KeyD": false,
            "KeyK": false
        }

        this.sprintCounter = 0;
        this.dashDuration = 2;
        this.dashTimer = this.dashDuration;
        this.dashing = false;
        this.shifting = false;
        this.frozenDirection = 1;
        this.canDash = false;
        this.dashCooldown = 0;

        this.convertKeys = (code) =>
        {
            if (code == "ArrowLeft")
                return "KeyA";
            if (code == "ArrowRight")
                return "KeyD";
            if (this.keys[code] != undefined)
                return code;
            return "urmom";
        }

        window.addEventListener("keydown", (e) => {
            if (e.code == "ShiftLeft" && !this.dashing && this.direction != 0)
            {
                if (this.maxV.x != this.runningSpeed)
                    this.maxV.x = this.runningSpeed;

                this.shifting = true;
            }

            const code = this.convertKeys(e.code);
            if (code != "urmom")
            {
                if (!this.keys[code])
                {
                    if (code == "KeyK" && this.grounded && !this.jumping)
                    {
                        this.jumping = true;
                        this.v.y = 0;
                        this.keys[code] = true;
                        return;
                    }
                    this.direction += this.axisMapping[code];
                    if (code != "KeyK")
                        this.keys[code] = true;
                }
            }
            
        });
        window.addEventListener("keyup", (e) => {
            if (e.code == "ShiftLeft" && !this.dashing)
            {
                if (this.maxV.x != this.walkingSpeed)
                    this.maxV.x = this.walkingSpeed;

                if (this.sprintCounter <= 8 && this.sprintCounter != 0 && this.canDash && this.dashCooldown == 0)
                {
                    this.maxV.x = 96;
                    this.speed = 64;
                    this.dashTimer = 0;
                    this.dashing = true;

                    this.v.y = 0;
                    this.gravityMultiplier = 0;

                    this.canDash = false;
                    this.dashCooldown = 16;
                }
                this.sprintCounter = 0;
                this.shifting = false;
            }

            const code = this.convertKeys(e.code);
            if (code != "urmom" && this.keys[code])
            {
                this.direction -= this.axisMapping[code];
                this.keys[code] = false;
            }
        });
    }

    updateMovement()
    {
        if (this.keys["KeyK"]&&this.jumping)
        {
            this.jumpCounter--;
        }
        if (this.jumpCounter < this.jumpStepsLeft && this.jumpCounter >= 0)
        {
            this.v.y += this.jumpStrength/this.jumpSteps + (Math.min(this.maxV.x,8)-this.walkingSpeed)/6;
            this.jumpStepsLeft--;
        }
        if (this.shifting)
            this.sprintCounter++;

        if (this.dashCooldown > 0)
            this.dashCooldown--;
        if (!this.grounded)
            this.dashCooldown = 0;

        if (this.sprintCounter > 32)
        {
            this.maxV.x = this.sprintSpeed;
        }

        if (this.dashTimer < this.dashDuration)
        {
            this.dashTimer++;

            this.v.x += this.frozenDirection * this.speed;
            if (Math.abs(this.v.x) > this.maxV.x)
                this.v.x = Math.sign(this.v.x) * this.maxV.x;
            return;
        }
        else if (this.dashing)
        {
            this.speed = this.acceleration;
            this.maxV.x = this.walkingSpeed;
            this.dashing = false;
            return;
        }
        if (this.gravityMultiplier < 1)
        {
            this.gravityMultiplier += 0.1;
        }
        if (this.direction != 0)
        {
            this.frozenDirection = this.direction;

            this.v.x = this.grounded ? this.v.x + this.direction * this.speed : this.v.x + this.direction * this.speed * this.airControl;
            if (Math.abs(this.v.x) > this.maxV.x)
                this.v.x = Math.sign(this.v.x) * this.maxV.x;
            return;
        }
        
        if (Math.abs(this.v.x) > this.maxV.x)
            this.v.x = Math.sign(this.v.x) * this.maxV.x;
        if (this.v.x != 0 && (this.grounded || !this.jumping))
        {
            this.v.x = this.v.x > 0 ? Math.floor(this.v.x - this.v.x/8) : Math.ceil(this.v.x - this.v.x/8);
            return;
        }
        if (this.v.x != 0 && !this.grounded && this.jumping)
            this.v.x = this.v.x > 0 ? this.v.x-0.1 : this.v.x+0.1;
    }
    
    collideTop({x,y,w,h,o})
    {
        const _o = this.t.h * this.t.o.y;

        const _x = this.t.x + this.t.w * this.t.o.x;
        const _y = this.t.y + _o;

        const oldy = this.oldt.y + _o;
        
        const __x = x + w * o.x;
        const __y = y + h * o.y;

        if (_x+this.t.w >= __x   &&
            _x          <= __x+w &&
            _y          <= __y+h &&
            oldy        >= __y+h)
        {
            this.v.y = 0;
            this.t.y = __y+h - _o;
            return true;
        }
        
        return false;
    }
    collideBottom({x,y,w,h,o})
    {
        const _o = this.t.h * this.t.o.y;

        const _x = this.t.x + this.t.w * this.t.o.x;
        const _y = this.t.y + _o;

        const oldy = this.oldt.y + _o;
        
        const __x = x + w * o.x;
        const __y = y + h * o.y;

        if (_x+this.t.w   >= __x   &&
            _x            <= __x+w &&
            _y+this.t.h   >= __y   &&
            oldy+this.t.h <= __y)
        {
            this.v.y = 0;
            this.t.y = __y+_o;
            this.grounded = true;
            this.canDash = true;
            this.jumping = false;
            this.jumpCounter = this.jumpSteps;
            this.jumpStepsLeft = this.jumpSteps;
            return true;
        }
        
        this.grounded = false;
        return false;
    }
    collideLeft({x,y,w,h,o})
    {
        const _o = this.t.w * this.t.o.x;

        const _x = this.t.x + _o;
        const _y = this.t.y + this.t.h * this.t.o.y;

        const oldx = this.oldt.x + _o;
        
        const __x = x + w * o.x;
        const __y = y + h * o.y;

        if (_x          <= __x+w &&
            oldx        >= __x+w &&
            _y+this.t.h >= __y   &&
            _y          <= __y+h)
        {
            this.v.x = 0;
            this.t.x = __x+w - _o+0.01;
            return true;
        }
        
        return false;
    }
    collideRight({x,y,w,h,o})
    {
        const _o = this.t.w * this.t.o.x;

        const _x = this.t.x + _o;
        const _y = this.t.y + this.t.h * this.t.o.y;

        const oldx = this.oldt.x + _o;
        
        const __x = x + w * o.x;
        const __y = y + h * o.y;

        if (_x+this.t.w   >= __x   &&
            oldx+this.t.w <= __x   &&
            _y+this.t.h   >= __y   &&
            _y            <= __y+h)
        {
            this.v.x = 0;
            this.t.x = __x - this.t.w - _o-0.01;
            return true;
        }
        
        return false;
    }

    Death()
    {
        console.log("YOU FUCKING DIED!");
    }
}