class Maurice extends Dynamic
{
    constructor({x,y,w,h,o}, c, collision = _BLOCKALL, player = new Player(), hp = 75, maxHp = 75, name = "MAURICE PRIME", broken = false, rageT)
    {
        super("img", {x,y,w,h,o}, c, collision);

        this.boss = true;
        this.name = name;
        this.broken = broken;
        this.hp = hp;
        this.maxHp = maxHp;
        this.player = player;

        this.dmgCD = 0;

        this.rageT = rageT;

        this.bulletCooldownTime = this.bulletCooldown = 4;
        this.bulletDuration = 32;
        this.bulletDurationTime = 0;
        this.cooldown = 32;
        this.cooling = 0;

        this.chargeTime = 16;
        this.charge = 0;
        this.charging = false;
        const cP = "Assets/Textures/charge/frame000";
        const frames = [];
        for (let i = 0; i < 7; i++)
        {
            frames.push(cP+i+".png");
        }
        this.chargeAni = 
        [
            new Rect("ani", this.t, frames, _NOCOLLISION, 0, Math.round(this.chargeTime/7), false),
            new Rect("ani", this.t, frames, _NOCOLLISION, 0, Math.round(this.chargeTime/7), false),
            new Rect("ani", this.t, frames, _NOCOLLISION, 0, Math.round(this.chargeTime/7), false)
        ];
        this.chargingAni = false;
        this.ding = false;

        this.flare = new Img(this.t, _Flare, _NOCOLLISION);
        this.flare.t.w = this.flare.ot.w = 256;
        this.flareActive = false;
        this.flareCount = 0;

        this.chargeAni[0].alpha = 1;
        this.chargeAni[1].alpha = 0.5;
        this.chargeAni[2].alpha = 0.3;
        this.chargeAni[1].r = 10;
        this.chargeAni[2].r = 20;

        this.bullets = [];
        this.origin = {x,y,w,h,o};
        this.target = {x:0,y:0};
        this.enraged = "";
        this.dying = false;
        this.dead = false;


        this.grounded = false;
        this.firstSlam = false;
        this.gravityMultiplier = 5;
        this.groundedThisFrame = false;

        this.attackPhase = 0;
    }

    dmg(dmg, {x,y}, explosion = false)
    {
        if (this.dmgCD == 0)
        {
            InstanceAudio(_THUNKSFX, 1).play();
            this.dmgCD = 4;
        }
        this.hp -= dmg;
        if (explosion)
            BLOODGENERATORS.push(new BloodGenerator({x:this.center.x,y:this.center.y}, dmg*12, 0.7, 10,12, true));
        else
            BLOODGENERATORS.push(new BloodGenerator({x:this.center.x,y:this.center.y}, dmg*12, 0.7, 10,12));
    }

    collideBottomA({y,h,o}, e)
    {
        this.v.y = 0;
        this.t.y = (y+h*o.y)-this.t.h;
        this.grounded = true;
        this.groundedThisFrame = true;
        if (!this.firstSlam)
        {
            display.stacks += 12;
            shakeReset = 64;
            this.firstSlam = true;
        }
    }

    rotate()
    {
        if (this.player.center.x < this.center.x)
        {
            this.c = _MauriceIMG["maurice"+this.enraged];

            let x = this.center.x - this.player.center.x;
            let y = this.center.y - this.player.center.y;
            const d = Math.sqrt(x**2+y**2);

            x/=d; y/=d;
            let angle = Math.atan(y/x);
            this.r = angle/Math.PI*180;

            this.origin.x = this.center.x-x*48+(-y*36);
            this.origin.y = this.center.y-y*48+(x*36);
            
            this.flip.x = -1;
            return;
        }

        this.c = _MauriceIMG["maurice"+this.enraged];

        let x = this.center.x - this.player.center.x;
        let y = this.center.y - this.player.center.y;
        const d = Math.sqrt(x**2+y**2);

        x/=d; y/=d;
        let angle = Math.atan(y/x);
        this.r = angle/Math.PI*180;

        this.origin.x = this.center.x-x*48+(y*36);
        this.origin.y = this.center.y-y*48+(-x*36);
        
        this.flip.x = 1;
    }

    update()
    {
        this.setOldTransform();

        if (this.dmgCD > 0)
            this.dmgCD--;

        for (const bullet of this.bullets)
        {
            bullet.update();
        }
        if (this.dying)
        {
            if (!this.grounded)
            {
                this.v.y += _GRAVITY*this.gravityMultiplier;
                if (this.isCollidingWith(this.player.t)) this.Mauriced();
            }
            this.t.y -= this.v.y;
            this.t.x += this.v.x;
            this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};
            return;
        }

        if (this.charge <= Math.floor(this.chargeTime/2.5))
            this.rotate();

        if (this.hp <= 0)
        {
            this.die();
        }

        if (this.broken == true) return;

        if (this.hp <= (this.rageT != undefined ? this.rageT:this.maxHp/2) && this.enraged == "")
        {
            this.c = _MauriceIMG["mauriceE"];
            this.bulletCooldownTime/=2;
            this.cooldown/=2;
            this.cooling = this.cooldown;
            this.chargeTime/=2;
            
            for (const element of this.chargeAni)
            {
                element.delay = 1;
                element.delayC = 0;
            }

            this.charge=0;
            this.enraged = "E";
        }
        if (PLAYER.dying)
            return;


        if (this.cooling >= this.cooldown)
        {
            if (this.charging)
            {
                if (this.charge < this.chargeTime)
                {
                if (this.charge == Math.floor(this.chargeTime/2.5))
                        this.target = {x:this.player.center.x, y:this.player.center.y};

                    if (this.charge > Math.floor(this.chargeTime/2.5)) this.chargingAni = false;
                    
                    if (this.flareActive && this.flareCount == 0)
                        this.flareActive = false;

                    if (this.flareActive && this.flareCount > 0)
                        this.flareCount--;

                    if (!this.ding) for (const element of this.chargeAni)
                    {
                        element.t.x = this.origin.x;
                        element.t.y = this.origin.y;
                        element.t.w -= (this.cooldown+this.chargeTime)/(element.frameSet.length*element.delay)*(element.ot.w*1.5);
                        element.t.h -= (this.cooldown+this.chargeTime)/(element.frameSet.length*element.delay)*(element.ot.w*1.5);
                        if (element.t.w < 0)
                        {
                            element.t.w = 256;

                            if (!this.ding)
                            {
                                this.flareActive = true;
                                this.flareCount+=2;
                                this.flare.t.x = this.origin.x;
                                this.flare.t.y = this.origin.y;
                                this.ding = true;
                            }
                        }
                        if (element.t.h < 0)
                        {
                            element.t.h = 256;

                            if (!this.ding)
                            {
                                this.flareActive = true;
                                this.flareCount+=2;
                                this.flare.t.x = this.origin.x;
                                this.flare.t.y = this.origin.y;
                                this.ding = true;
                            }
                        }
                    }

                    this.charge++;
                }
                else
                {
                    InstanceAudio(_PEWSFX,0.2).play();
                    this.bullets.push(new Bullet(this.origin, _BulletPIMG, _NOCOLLISION, this.target, this, true));
                    currentCtx.FOREGROUNDQUEUE.push(this.bullets[this.bullets.length-1]);
                    this.cooling = 0;
                }
                return;
            }

            if (this.bulletDurationTime >= this.bulletDuration)
            {
                this.bulletDurationTime = 0;
                this.cooling = 0;
            }
            else
            {
                this.bulletDurationTime++;
            }
            
            if (this.bulletCooldown >= this.bulletCooldownTime)
            {
                this.bulletCooldown = 0;
                InstanceAudio(_PEWSFX,0.2).play();
                this.bullets.push(new Bullet(this.origin, _BulletIMG, _NOCOLLISION, {x:this.player.center.x, y:this.player.center.y}, this));
                currentCtx.FOREGROUNDQUEUE.push(this.bullets[this.bullets.length-1]);
            }
            else
            {
                this.bulletCooldown++;
            }
        }
        else
        {
            this.cooling++;

            if (this.charge > 0)
                this.charge = 0;

            if (this.charging)
            {
                for (const element of this.chargeAni)
                {
                    element.t.x = this.origin.x;
                    element.t.y = this.origin.y;
                }
            }
            if (this.cooling > 1)
                return;

            if (this.broken != "NOCHARGE")
                this.attackPhase = ((this.attackPhase) % 3) + 1;
            else
                this.attackPhase = 1;

            if (this.attackPhase == 3)
            {
                this.charging = true;
                this.charge = 0;
                for (const element of this.chargeAni)
                {
                    element.t.w = element.ot.w*1.5;
                    element.t.h = element.ot.h*1.5;
                    element.t.x = this.origin.x;
                    element.t.y = this.origin.y;
                    element.frame = 0;
                }
                this.ding = false;
                this.chargingAni = true;
            }
            else
            {
                this.charging = false;
            }
        }
    }

    render()
    {
        if (this.enraged == "E")
            display.drawImg(currentCtx,
            {
                x:this.center.x + (Math.random()-0.5)*8,
                y:this.center.y + (Math.random()-0.5)*8,
                w:this.t.w+32,
                h:this.ot.h+32,
                o:this.t.o
            }, _ENRAGEDAURA);
        
        display.drawImg(currentCtx,
        {
            x:this.t.x + (this.enraged == "E" ? (Math.random()-0.5)*8 : 0),
            y:this.t.y + (this.enraged == "E" ? (Math.random()-0.5)*8 : 0),
            w:this.t.w,
            h:this.dying? this.ot.h:this.t.h,
            o:this.t.o
        }, this.c, this.alpha, this.r, this.flip.x, this.flip.y);

        this.renderMore();
    }

    renderMore()
    {
        for (let i = 0; i < this.bullets.length; i++)
        {
            if (!this.bullets[i].active || this.dying)
            {
                this.bullets[i].active = false;
                this.bullets.splice(i,1);
            }
        }

        if (this.flareActive)
        {
            this.flare.render();
            this.flare.r+=90;
            this.flare.render();

            this.flare.r = 0;
        }

        if (this.chargingAni)
        {
            for (let i = 0; i < this.chargeAni.length; i++)
            {
                this.chargeAni[i].r += 10;
                this.chargeAni[i].render();
            }
        }
    }

    die()
    {
        InstanceAudio(_DEDSFX, 1).play();
        InstanceAudio(_DEDSFX, 1).play();
        InstanceAudio(_DEDSFX, 1).play();

        this.dmg(32,{x:0,y:0});
        display.stacks += 12;
        shakeReset = 64;
        this.t.h /= 2;
        this.t.o.y = 0;
        this.r = 0;
        this.dying = true;
        this.chargingAni = false;
        this.flareActive = false;

        for (const bullet of this.bullets)
            bullet.active = false;
        
        this.setOldTransform();
    }
    Mauriced()
    {
        PLAYER.dmg(75, {x:0,y:0},true);
        POPUPQUEUE.push(new Popup({x:this.player.center.x, y:this.player.center.y}, ["+MAURICED"], 0.01));
    }
}