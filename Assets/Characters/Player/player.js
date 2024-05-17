class Sword extends Dynamic
{
    constructor(player, c)
    {
        super("img", player.t, c, _NOCOLLISION)

        this.directionY = 0;
        this.directionDuration = 20;
        this.directionTime =
        {
            "KeyW": this.directionDuration,
            "KeyS": this.directionDuration
        };
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

        this.stabbing = false;
        this.stabbingTime = this.stabbingTimeLeft = 4;
        this.stabCooldown = this.stabCooling = 8;
        this.stabStep = {x:0,y:0};
        this.justStoppedStabbing = false;
        this.chargingStab = false;
        this.maxStabCharge = 32;
        this.stabCharge = 0;

        this.t.w = 16;
        this.t.h = 128;
        this.t.o = {x:-0.5,y:-1};
        this.r = 70;
        this.destination = this.st = this.t;

        const SwordAuraImg = new Image();
        SwordAuraImg.src = "Assets/Characters/Player/swordAura.png";
        this.swordAura = new Img(
            {
            x:this.t.x,
            y:this.t.y,
            w:SwordAuraImg.width,
            h:SwordAuraImg.height,
            o:this.st.o
        }, SwordAuraImg);

        window.addEventListener(("keydown"), (e) =>
        {
            if (this.keys[e.code])
                return;
            this.keys[e.code] = true;

            if (e.code == "KeyJ")
            {
                if (this.stabCooldown == this.stabCooling)
                {
                    this.t.o = this.st.o = {x:-0.5, y:0};
                    this.chargingStab = true;
                    return;
                }
                this.keys[e.code] = false;
                return;
            }

            if (this.directions[e.code] != undefined)
            {
                if (this.directionTime[e.code] == this.directionDuration)
                    this.directionTime[e.code] = 0;
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
                if (this.stabCooldown == this.stabCooling)
                    this.stab();
                return;
            }

            if (this.directions[e.code] != undefined)
            {
                this.directionY -= this.directions[e.code];
                this.directionTime[e.code] = this.directionDuration;
            }
        });
    }

    charge()
    {
        if (this.stabCharge < this.maxStabCharge)
            this.stabCharge++;

        this.r = -this.player.frozenDirection * 80;
        this.t.x = this.player.center.x + -this.player.frozenDirection * 48;
        this.t.y = this.player.t.y - 16;
    }

    stab()
    {
        this.stabbing = true;
        this.chargingStab = false;
        this.stabCooling = 0;
        this.stabbingTimeLeft = 0;
        
        if (this.directionY == 0)
        {
            let ox = -1; 
            if (this.player.frozenDirection > 0)
                ox = 0;
            this.destination =
            {
                x: this.player.center.x + this.player.frozenDirection * 48,
                y: this.player.center.y,
                w: 128,
                h: 16,
                o: {x:ox,y:-0.5}
            }
            this.st.o.y = 0;
            this.r = 90*-this.player.frozenDirection;
            return;
        }

        let oy = -1; 
        if (this.directionY > 0)
            oy = 0;
        this.destination =
        {
            x: this.player.center.x,
            y: this.player.center.y + this.directionY * 64,
            w: 16,
            h: 128,
            o: {x:-0.5,y:oy}
        }
        this.st.o.y = 0;
        this.r = oy*180;
    }

    keyDuration()
    {
        if (this.directionTime["KeyW"] < this.directionDuration)
        {
            this.directionTime["KeyW"]++;
            if (this.directionTime["KeyW"] == this.directionDuration)
            {
                this.keys["KeyW"] = false;
                this.directionY -= this.directions["KeyW"];
            }
        }
        if (this.directionTime["KeyS"] < this.directionDuration)
        {
            this.directionTime["KeyS"]++;
            if (this.directionTime["KeyS"] == this.directionDuration)
            {
                this.keys["KeyS"] = false;
                this.directionY -= this.directions["KeyS"];
            }
        }
    }

    update()
    {
        this.setOldTransform();

        this.keyDuration();

        if (this.chargingStab)
        {
            this.charge();
            return;
        }

        if (this.stabCooling < this.stabCooldown && this.stabbingTimeLeft == this.stabbingTime)
            this.stabCooling++;

        if (this.stabbing)
        {
            this.t.x = this.player.center.x;
            this.t.y = this.player.center.y;
            this.stabStep = {x:(this.destination.x-this.t.x)/this.stabbingTime,y:(this.destination.y-this.t.y)/this.stabbingTime}
            this.t = this.destination;
            this.stabbing = false;
            return;
        }
        if (this.stabbingTimeLeft < this.stabbingTime)
        {
            this.stabbingTimeLeft++;
            this.moveBy(this.stabStep);
            if (this.stabbingTimeLeft == this.stabbingTime)
            {
                this.justStoppedStabbing = true;
            }
            return;
        }
        if (this.justStoppedStabbing)
        {
            this.t.w = 16;
            this.t.h = 128;
            this.t.o = this.st.o = {x:-0.5,y:-1};
            this.justStoppedStabbing = false;
        }
        this.r = this.player.frozenDirection * 70;
        this.t.x = this.player.t.x + -this.player.frozenDirection * 64;
        this.t.y = this.player.t.y + 64;
    }
    render()
    {
        this.swordAura.t =
        {
            x:this.t.x,
            y:this.t.y,
            w:this.swordAura.t.w,
            h:this.swordAura.t.h,
            o:this.st.o
        };

        if (this.stabbingTimeLeft < this.stabbingTime)
            display.drawImg(currentCtx,this.swordAura.t, this.swordAura.c, 0.8, this.r);

        display.drawImg(currentCtx,
        {
            x:this.t.x,
            y:this.t.y,
            w:this.st.w,
            h:this.st.h,
            o:this.st.o
        }, this.c, 1, this.r);

        if (this.renderMore != undefined)
            this.renderMore();
    }
}

class Player extends Physics
{
    constructor(type = "img", {x,y,w,h,o}, c)
    {
        super(type, {x,y,w,h,o}, c, _NOCOLLISION);

        this.player = true;
        const swordIMG = new Image();
        swordIMG.src = "Assets/Characters/Player/sword.png";
        this.sword = new Sword(this, swordIMG);

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
    
    collideTopA({y,h,o})
    {
        this.v.y = 0;
        this.t.y = (y + h * o.y)+h - this.t.h*this.t.o.y;
    }
    collideBottomA({y,h,o})
    {
        this.v.y = 0;
        this.t.y = (y + h * o.y)+this.t.h*this.t.o.y;
        this.grounded = true;
        
        this.canDash = true;

        this.jumping = false;
        this.jumpCounter = this.jumpSteps;
        this.jumpStepsLeft = this.jumpSteps;
        this.airJumpsLeft = this.maxAirJump;
    }
    collideLeftA({x,w,o})
    {
        this.v.x = 0;
        this.t.x = (x + w * o.x)+w - this.t.w*this.t.o.x+0.01;
    }
    collideRightA({x,w,o})
    {
        this.v.x = 0;
        this.t.x = (x + w * o.x) - this.t.w - this.t.w*this.t.o.x-0.01;
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
        this.sword.render();
    }
}