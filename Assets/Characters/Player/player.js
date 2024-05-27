class Player extends Physics
{
    constructor(type = "ani", {x,y,w,h,o}, c)
    {
        super(type, {x,y,w,h,o}, c, _NOCOLLISION);

        this.player = true;
        this.hp = this.maxHp = 12;
        this.hardDmg = 0;
        this.lastHit = 0;
        this.sword = {};
        this.dying = false;
        this.ULTRACOUNT = -1;
        this.ULTRACTX = {};

        this.dmgCD = 0;

        this.sinRo = 0;

        this.bullets = [];

        this.center = {x:0,y:0};

        this.radius = 112;

        this.shield = false;

        const sP = "Assets/Characters/Player/Shield/shield000";
        const frames = [];
        for (let i = 0; i < 6; i++)
        {
            frames.push(sP+i+".png");
        }
        this.shieldAni = new Rect("ani",
        {
            x: this.center.x,
            y: this.center.y,
            w: this.radius*2,
            h: this.radius*2,
            o: {x:-0.5,y:-0.5}
        }, frames, _NOCOLLISION);
        this.shieldAni.alpha = 0.5;
        
        // Movements
        this.direction = 0;
        this.frozenDirection = 1;

        this.walkingSpeed = 8; this.airControl = 0.2;

        this.maxV.x = this.walkingSpeed; this.acceleration = 2; this.speed = this.acceleration;

        this.jumpStrength = 24; this.jumpSteps = 5; this.jumpStepsLeft = this.jumpSteps; this.jumpCounter = this.jumpSteps; this.jumping = false;
        this.maxAirJump = 1; this.airJumpsLeft = this.maxAirJump; this.airJumpStrength = 16;

        this.axisMapping = {
            "KeyA":-1,
            "KeyD": 1,
            "KeyK": 0
        }
        this.keys = {
            "KeyA": false,
            "KeyD": false,
            "KeyK": false
        }

        this.dashDuration = 2; this.dashTimer = this.dashDuration; this.dashing = false; this.canDash = false; this.dashCooldown = 0; this.airDashLeft = 1;

        this.shifting = false;

        this.convertKeys = (code) =>
        {
            if (code == "ArrowLeft")
                return "KeyA";
            if (code == "ArrowRight")
                return "KeyD";
            if (code == "Space")
                return "KeyK";
            if (this.keys[code] != undefined)
                return code;
            return "urmom";
        }

        window.addEventListener("keydown", (e) =>
        {
            if (this.dying)
                return;

            if (e.code == "ShiftLeft" && !this.shifting)
            {
                this.startDash();
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
            this.frozenDirection = this.axisMapping[code];
            this.direction += this.axisMapping[code];
            this.keys[code] = true;
            
        });
        window.addEventListener("keyup", (e) =>
        {
            if (this.dying)
                return;
            
            if (e.code == "ShiftLeft")
            {
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

    dmg(dmg, {x,y}, explosion = false)
    {
        if (this.dmgCD == 0)
        {
            InstanceAudio(_THUNKSFX, 1).play();
            this.dmgCD = 4;
        }

        this.hp -= dmg;
        if (dmg < this.hp)
            this.hardDmg += dmg/2;
        this.lastHit = 128;

        if (explosion)
            BLOODGENERATORS.push(new BloodGenerator({x:this.center.x,y:this.center.y}, dmg*4, 0.7, 6,8, true));
        else
            BLOODGENERATORS.push(new BloodGenerator({x:x+(Math.random()-0.5)*16,y:y+64}, dmg*12, 0.7, 6, 8));
    }

    startDash()
    {
        if (this.dashCooldown == 0 && this.airDashLeft != 0)
        {
            this.maxV.x = 96;
            this.speed = 64;
            this.dashTimer = 0;
            this.dashing = true;

            this.v.y = 0;
            this.gravityMultiplier = 0;

            this.canDash = false;
            this.airDashLeft--;
            this.dashCooldown = 16;
        }
        
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

        // Dash
        if (this.dashCooldown > 0)
            this.dashCooldown--;
        if (!this.grounded)
            this.dashCooldown = 0;
        if (this.grounded)
            this.airDashLeft = 1;
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
        if (this.dmgCD > 0) this.dmgCD--;

        if (this.ULTRACOUNT == 0)
            this.ULTRACTX.FOREGROUNDQUEUE.splice(this.ULTRACTX.FOREGROUNDQUEUE.indexOf(_ULTRASAD), 1);
        if (this.ULTRACOUNT > 0)
            this.ULTRACOUNT--;

        if (this.hp <= 0 && !this.dying)
        {
            this.dmg(64, {x:0,y:0},true);
            this.Death();
        }

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
        if (this.gravityMultiplier < 1 && !this.dying)
        {
            this.gravityMultiplier += 0.1;
        }
        if (this.direction != 0)
        {
            this.frozenDirection = this.direction;
            this.flip.x = this.direction;

            this.v.x = this.grounded ? this.v.x + this.direction * this.speed : this.v.x + this.direction * this.speed * this.airControl;
            if (Math.abs(this.v.x) > this.maxV.x)
                this.v.x = Math.sign(this.v.x) * this.maxV.x;
            return;
        }
        
        this.updateMiscPhysics();
    }

    collideAllA({}, e)
    {
        if (e.PICKMEUP)
        {
            Battle01.currentTime = 0.3;
            Battle01.play();

            currentCtx.dark = false;
            currentCtx.FOREGROUNDQUEUE.push(_ULTRASAD);
            this.ULTRACOUNT = 256;
            this.ULTRACTX = currentCtx;

            display.color = "darkred";

            this.sword = new Sword(this, _swordIMG);
            e.PICKMEUP = false;

            currentCtx.background.splice(levels[0].background.indexOf(e), 1);
            ALL.splice(ALL.indexOf(e), 1)

            currentCtx.BACKGROUND.clearRect(0,0,res.w,res.h);
            for (const element of levels[0].background)
            {
                if (element.visible)
                {
                    element.render(levels[0].BACKGROUND);
                }
            }
        }
    }
    
    collideTopA({y,h,o})
    {
        if (this.dying)
            return;
        
        this.v.y = 0;
        this.t.y = (y+h*o.y)+h - this.t.h*this.t.o.y;
    }
    collideBottomA({y,h,o})
    {
        if (this.dying)
            return;
        
        this.v.y = 0;
        this.t.y = (y+h*o.y)+this.t.h*this.t.o.y;
        this.grounded = true;
        
        this.canDash = true;

        this.jumping = false;
        this.jumpCounter = this.jumpSteps;
        this.jumpStepsLeft = this.jumpSteps;
        this.airJumpsLeft = this.maxAirJump;
    }
    collideLeftA({x,w,o})
    {
        if (this.dying)
            return;
        
        this.v.x = 0;
        this.t.x = (x+w*o.x)+w - this.t.w*this.t.o.x+0.01;
    }
    collideRightA({x,w,o})
    {
        if (this.dying)
            return;

        this.v.x = 0;
        this.t.x = (x+w*o.x) - this.t.w - this.t.w*this.t.o.x-0.01;
    }

    Death()
    {
        this.dying = true;
        this.gravityMultiplier = 0;
        this.v.y = 1;
        this.direction = 0;
        for (let i = 0; i < this.bullets.length; i++)
        {
            this.bullets[i].explode();
        }
    }

    lateUpdate()
    {
        if (this.lastHit > 0)
            this.lastHit--;
        else if (this.hardDmg > 0)
            this.hardDmg-=0.05;
        for (const bullet of this.bullets)
        {
            bullet.update();
        }

        if (this.dying)
        {
            this.alpha *= 0.99;
            if (this.alpha < 0.1) this.alpha = 0;
            return;
        }
        if (this.sword.update != undefined) this.sword.update();

        this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};
    }

    updateMore()
    {
        this.shieldAni.t =
        {
            x: this.center.x,
            y: this.center.y,
            w: this.radius*2,
            h: this.radius*2,
            o: {x:-0.5,y:-0.5}
        };
    }

    renderMore()
    {
        if (this.dying)
            return;

        this.ro.y = (Math.sin(this.sinRo)-0.5)*8;
        this.sinRo+=Math.PI/_ENGINE.fps;

        for (let i = 0; i < this.bullets.length; i++)
        {
            if (!this.bullets[i].active)
            {
                this.bullets.splice(i,1);
            }
        }

        if (this.sword.render != undefined) this.sword.render();

        if (this.shield)
            this.shieldAni.render();
    }
}