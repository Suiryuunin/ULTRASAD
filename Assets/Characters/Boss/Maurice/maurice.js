class Maurice extends Dynamic
{
    constructor({x,y,w,h,o}, c, collision = _BLOCKALL, player = new Player())
    {
        super("img", {x,y,w,h,o}, c, collision);

        this.boss = true;
        this.name = "MAURICE PRIME"
        this.hp = 75;
        this.maxHp = 75;
        this.player = player;

        this.bulletCooldownTime = this.bulletCooldown = 4;
        this.bulletDuration = 32;
        this.bulletDurationTime = 0;
        this.cooldown = 32;
        this.cooling = 0;

        this.chargeTime = this.charge = 16;
        this.charging = false;
        const cP = "Assets/Characters/Boss/Maurice/Textures/charge/frame000";
        const frames = [];
        for (let i = 0; i < 7; i++)
        {
            frames.push(cP+i+".png");
        }
        this.chargeAni = 
        [
            new Rect("ani", this.t, frames, _NOCOLLISION, 0, Math.round(this.chargeTime/7), false),
            new Rect("ani", this.t, frames, _NOCOLLISION, 0, Math.round(this.chargeTime/7), false),
            new Rect("ani", this.t, frames, _NOCOLLISION,0,  Math.round(this.chargeTime/7), false)
        ];
        this.chargingAni = false;
        this.ding = false;

        this.chargeAni[0].alpha = 1;
        this.chargeAni[1].alpha = 0.5;
        this.chargeAni[2].alpha = 0.3;
        this.chargeAni[1].r = 10;
        this.chargeAni[2].r = 20;

        this.bullets = [];
        this.target = {x:0,y:0};
        this.enraged = false;
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
        this.hp -= dmg;
        if (explosion)
            BLOODGENERATORS.push(new BloodGenerator({x:this.center.x,y:this.center.y}, dmg*12, 0.7, 10,12, true));
        else
            BLOODGENERATORS.push(new BloodGenerator({x:this.center.x,y:this.center.y}, dmg*12, 0.7, 10,12));
    }

    collideBottomA({y,h,o}, e)
    {
        this.v.y = 0;
        this.t.y = (y+h*o.y)+this.t.h*this.t.o.y;
        this.grounded = true;
        this.groundedThisFrame = true;
        if (!this.firstSlam)
        {
            display.stacks += 12;
            shakeReset = 64;
            this.firstSlam = true;
        }
    }

    update()
    {
        this.setOldTransform();
        for (const bullet of this.bullets)
        {
            bullet.update();
        }
        if (this.dying)
        {
            if (!this.grounded)
            {
                this.v.y += _GRAVITY*this.gravityMultiplier;
                if (this.isCollidingWith(this.player.t)) Mauriced();
            }
            this.t.y -= this.v.y;
            this.t.x += this.v.x;
            this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};
            return;
        }
        if (this.hp <= 0)
        {
            this.dmg(75,{x:0,y:0});
            display.stacks += 12;
            shakeReset = 64;
            this.dying = true;
        }
        if (this.hp <= this.maxHp/2 && !this.enraged)
        {
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
            this.enraged = true;
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
                    
                    
                    if (!this.ding) for (const element of this.chargeAni)
                    {
                        element.t.w -= (this.cooldown+this.chargeTime)/(element.frameSet.length*element.delay)*(element.ot.w*1.5);
                        element.t.h -= (this.cooldown+this.chargeTime)/(element.frameSet.length*element.delay)*(element.ot.w*1.5);
                        if (element.t.w < 0)
                        {
                            element.t.w = 256;
                            this.ding = true;
                        }
                        if (element.t.h < 0)
                        {
                            element.t.h = 256;
                            this.ding = true;
                        }
                    }

                    this.charge++;
                }
                else
                {
                    this.bullets.push(new Bullet(this.t, _BulletPIMG, _NOCOLLISION, this.target, this, true));
                    FOREGROUNDQUEUE.push(this.bullets[this.bullets.length-1]);
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
                this.bullets.push(new Bullet(this.t, _BulletIMG, _NOCOLLISION, {x:this.player.center.x, y:this.player.center.y}, this));
                FOREGROUNDQUEUE.push(this.bullets[this.bullets.length-1]);
            }
            else
            {
                this.bulletCooldown++;
            }
        }
        else
        {
            this.cooling++;

            if (this.charging)
            {
                for (const element of this.chargeAni)
                {
                    (this.cooldown+this.chargeTime)/(element.frameSet.length*element.delay)*(element.ot.w*1.5);
                    (this.cooldown+this.chargeTime)/(element.frameSet.length*element.delay)*(element.ot.w*1.5);
                }
            }
            if (this.cooling > 1)
                return;

            this.attackPhase = ((this.attackPhase) % 3) + 1;
            if (this.attackPhase == 3)
            {
                this.charging = true;
                this.charge = 0;
                for (const element of this.chargeAni)
                {
                    element.t.w = element.ot.w*1.5;
                    element.t.h = element.ot.h*1.5;
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

    renderMore()
    {
        for (let i = 0; i < this.bullets.length; i++)
        {
            if (!this.bullets[i].active)
            {
                this.bullets.splice(i,1);
            }
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
}

// MAURICED

function Mauriced()
{
    PLAYER.dmg(75, {x:0,y:0},true);
}