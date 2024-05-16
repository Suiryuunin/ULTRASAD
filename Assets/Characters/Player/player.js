class Sword extends Dynamic
{
    constructor(player, c)
    {
        super("img", player.t, c, _NOCOLLISION)

        this.directionY = 0;
        this.directions =
        {
            "KeyW": -1,
            "KeyS": 1
        };
        this.keys =
        {
            "KeyW": false,
            "KeyS": false
        };

        this.player = player;
        this.t.w = 16;
        this.t.h = 128;
        this.t.o = {x:-0.5,y:-1};
        this.r = 70;

        window.addEventListener(("keydown"), (e) =>
        {
            if (this.keys[e.code])
                return;
            this.keys[e.code] = true;

            if (e.code == "KeyJ")
            {
                this.chargingStab = true;
                return;
            }

            if (this.directions[e.code] != undefined)
            {
                this.directionY += this.directions[e.code];
            }
        });

        window.addEventListener("keyup", (e) =>
        {
            if (!this.keys[e.code])
                return;
            this.keys[e.code] = false;

            if (e.code == "KeyJ")
            {
                this.stab();
                return;
            }

            if (this.directions[e.code] != undefined)
            {
                this.directionY -= this.directions[e.code];
            }
        });
    }

    stab()
    {
        console.log(this.directionY == 0 ? this.player.frozenDirection : this.directionY);
    }

    update()
    {
        this.setOldTransform();

        this.t.x = this.player.t.x + this.player.frozenDirection * 42;
        this.r = -this.player.frozenDirection * 110;
        this.t.y = this.player.t.y + 24;
    }
}

class Player extends Physics
{
    constructor(type = "img", {x,y,w,h,o}, c)
    {
        super(type, {x,y,w,h,o}, c, _NOCOLLISION);

        this.player = true;
        this.sword = new Sword(this, this.c);

        this.center = {x:0,y:0};
        
        // Movements
        this.direction = 0;
        this.frozenDirection = 1;

        this.walkingSpeed = 4; this.runningSpeed = 6; this.sprintSpeed = 8; this.airControl = 0.2;

        this.maxV.x = this.walkingSpeed; this.acceleration = 2; this.speed = this.acceleration;

        this.jumpStrength = 24; this.jumpSteps = 5; this.jumpStepsLeft = this.jumpSteps; this.jumpCounter = this.jumpSteps; this.jumping = false;
        this.maxAirJump = 1; this.airJumpsLeft = this.maxAirJump; this.airJumpStrength = 16;

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
                if (!this.grounded && this.airJumpsLeft > 0)
                {
                    this.v.y = this.airJumpStrength;
                    this.airControl = 1;
                    this.airJumpsLeft--;
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

        if (this.v.y < 0)
            this.airControl = 0.2;

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
            this.airJumpsLeft = this.maxAirJump;
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

    lateUpdate()
    {
        this.sword.update();
        this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};
    }

    renderMore()
    {
        display.drawImg(currentCtx, this.sword.t, this.sword.c, 1, this.sword.r);
    }
}