class Maurice extends Dynamic
{
    constructor({x,y,w,h,o}, c, collision = _BLOCKALL, player = new Player())
    {
        super("img", {x,y,w,h,o}, c, collision);

        this.boss = true;
        this.name = "MAURICE PRIME"
        this.hp = this.maxHp = 15;
        this.player = player;

        this.bulletCooldownTime = this.bulletCooldown = 4;
        this.bulletDuration = 32;
        this.bulletDurationTime = 0;
        this.cooldown = 32;
        this.cooling = 0;
        this.chargeTime = this.charge = 16;
        this.charging = false;
        this.bullets = [];
        this.target = {x:0,y:0};
        this.enraged = false;
        this.dying = false;
        this.grounded = false;
        this.firstSlam = false;
        this.gravityMultiplier = 0.01;

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

    collideBottomA({y,h,o})
    {
        this.v.y = 0;
        this.t.y = (y+h*o.y)+this.t.h*this.t.o.y;
        this.grounded = true;
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
            this.gravityMultiplier *= 1.5;
            if (!this.grounded)
                this.v.y += _GRAVITY*this.gravityMultiplier;
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
            this.cooling = 0;
            this.cooldown/=2;
            this.chargeTime/=2;
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
                    this.charge++;
                }
                else
                {
                    this.bullets.push(new Bullet(this.t, BulletPIMG, _NOCOLLISION, this.target, this, true));
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
                this.bullets.push(new Bullet(this.t, BulletIMG, _NOCOLLISION, {x:this.player.center.x, y:this.player.center.y}, this));
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
            this.attackPhase = ((this.attackPhase) % 3) + 1;
            if (this.attackPhase == 3)
            {
                this.charging = true;
                this.charge = 0;
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
                FOREGROUNDQUEUE.splice(FOREGROUNDQUEUE.indexOf(this.bullets[i]), 1);
                this.bullets.splice(i,1);
            }
        }
    }
}