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
    constructor(type, {x,y,w,h,o}, c, collision = _BLOCKALL)
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
        if (this.collision == _BLOCKALL)
        {
            this.isOCollidingWith(PLAYER.t)
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

        this.collision = _NOCOLLISION;
        this.player = true;
        
        // Movements
        this.direction = 0;
        this.frozenDirection = 1;

        this.walkingSpeed = 4; this.runningSpeed = 6; this.sprintSpeed = 8; this.airControl = 0.2;

        this.maxV.x = this.walkingSpeed; this.acceleration = 2; this.speed = this.acceleration;

        this.jumpStrength = 24; this.jumpSteps = 5; this.jumpStepsLeft = this.jumpSteps; this.jumpCounter = this.jumpSteps; this.jumping = false;

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

        this.dashDuration = 2; this.dashTimer = this.dashDuration; this.dashing = false; this.canDash = false; this.dashCooldown = 0;

        this.shifting = false;

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
            if (e.code == "ShiftLeft" && !this.dashing)
            {
                this.run();
                this.shifting = true;
            } //
            const code = this.convertKeys(e.code);
            if (code == "urmom" || this.keys[code])
                return;
            if (code == "KeyK")
            {
                if (this.grounded && !this.jumping)
                {
                    this.startJump();
                    this.keys[code] = true;
                }
                return;
            }
            this.direction += this.axisMapping[code];
            this.keys[code] = true;
            
        });
        window.addEventListener("keyup", (e) => {
            if (e.code == "ShiftLeft" && !this.dashing)
            {
                this.runStop();
                this.startDash();
                this.shifting = false;
            } //
            const code = this.convertKeys(e.code);
            if (code != "urmom" && this.keys[code])
            {
                this.direction -= this.axisMapping[code];
                this.keys[code] = false;
            }
        });
    }

    run()
    {
        if (this.direction != 0 && this.maxV.x != this.runningSpeed)
            this.maxV.x = this.runningSpeed;
    }
    runStop()
    {
        if (this.maxV.x != this.walkingSpeed)
            this.maxV.x = this.walkingSpeed;
    }

    startDash()
    {
        if (this.sprintCounter <= 12 && this.sprintCounter != 0 && this.canDash && this.dashCooldown == 0)
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
    }
    dash()
    {
        this.v.x += this.frozenDirection * this.speed;
        if (Math.abs(this.v.x) > this.maxV.x)
            this.v.x = Math.sign(this.v.x) * this.maxV.x;
    }
    stopDash()
    {
        this.speed = this.acceleration;
        this.maxV.x = this.walkingSpeed;
        this.dashing = false;
    }

    startJump()
    {
        this.jumping = true;
        this.v.y = this.jumpSteps < 2 ? this.jumpStrength : 0;
    }
    jump()
    {
        this.v.y += this.jumpStrength/this.jumpSteps + (Math.min(this.maxV.x,8)-this.walkingSpeed)/6;
        this.jumpStepsLeft--;
    }

    updateCounters()
    {
        // Jumping
        if (this.keys["KeyK"] && this.jumping)
        {
            this.jumpCounter--;
        }
        if (this.jumpCounter < this.jumpStepsLeft && this.jumpCounter >= 0)
            this.jump();

        // Sprinting
        if (this.shifting)
            this.sprintCounter++;

        if (this.sprintCounter > 32)
        {
            this.maxV.x = this.sprintSpeed;
        }

        // Dash
        if (this.dashCooldown > 0)
            this.dashCooldown--;
        if (!this.grounded)
            this.dashCooldown = 0;
    }

    updateMiscPhysics()
    {
        // x speed cap
        if (Math.abs(this.v.x) > this.maxV.x)
            this.v.x = Math.sign(this.v.x) * this.maxV.x;

        // Deceleration grounded/falling
        if (this.v.x != 0 && (this.grounded || !this.jumping))
        {
            this.v.x = this.v.x > 0 ? Math.floor(this.v.x - this.v.x/8) : Math.ceil(this.v.x - this.v.x/8);
            return;
        }

        // Jumping
        if (this.v.x != 0 && !this.grounded && this.jumping)
            this.v.x = this.v.x > 0 ? this.v.x-0.1 : this.v.x+0.1;
    }

    updateMovement()
    {
        this.updateCounters();

        if (this.dashTimer < this.dashDuration)
        {
            this.dash();
            this.dashTimer++;
            return;
        }
        else if (this.dashing)
        {
            this.stopDash();
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
        
        this.updateMiscPhysics();
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
            this.v.y = 0;
            this.t.y = __y+h - _o;
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
        const _x = this.t.x + _o, _y = this.t.y + this.t.h * this.t.o.y;
        const oldx = this.oldt.x + _o;
        const __x = x + w * o.x, __y = y + h * o.y;

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
        const _x = this.t.x + _o, _y = this.t.y + this.t.h * this.t.o.y;
        const oldx = this.oldt.x + _o;
        const __x = x + w * o.x, __y = y + h * o.y;

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