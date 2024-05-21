const BulletIMG = new Image();
BulletIMG.src = "Assets/Characters/Boss/Maurice/Textures/bullet.png";

const dedBulletIMG = new Image();
dedBulletIMG.src = "Assets/Characters/Boss/Maurice/Textures/dedBullet.png";

class Bullet extends Dynamic
{
    constructor({x,y,w,h,o}, c, collision = _BLOCKALL, target, boss, SP = false)
    {
        super("img", {x,y,w,h,o}, c, collision);

        this.target = target;
        this.boss = boss;
        this.canStab = true;
        this.bullet = true;
        this.player = PLAYER;
        this.dying = false;
        this.SP = SP;

        //Player Control
        this.hijacked = false;
        this.trapped = true;
        this.angle = 0;
        this.radius = 128;
        this.hit = false;
        this.immune = 0;

        this.deathCountDown = this.initDC= 12;
        this.t.w = this.t.h = 48;
        this.speed = SP ? 128 : 16;
        this.slowing = false;
        this.r = 0;
        this.jitteriness = (Math.random()+1)*4;
        this.setDirectionTo({x:target.x, y:target.y});
        this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};

        this.shaking = false;
    }

    circleRectA({x,y}, d, e)
    {
        if (this.dying) return;

        
            if (d == 0) d = 1*(10**-64);
            const m = d/(d-Math.sign(d)*(this.t.w/4));
            const _x = (this.center.x- (x/(d/(d-Math.sign(d)*(this.t.w/2)))) )+this.t.w*this.t.o.x+this.t.w/2;
            const _y = (this.center.y- (y/(d/(d-Math.sign(d)*(this.t.w/2)))) )+this.t.h*this.t.o.y+this.t.h/2;
            x/=m;
            y/=m;
            
            this.t.x = (this.center.x-x)+this.t.w*this.t.o.x+this.t.w/2;
            this.t.y = (this.center.y-y)+this.t.h*this.t.o.y+this.t.h/2;

            this.shaking = true;
            if (!this.SP)
            {
                if (e.boss) explosions.push(new Explosion(this.t, EXPLOSIONIMG));
                else if (display.stacks < 4) display.stacks++;
                
                if (e.player) e.dmg(1, {x:_x,y:_y});
            }
            else
            {
                display.stacks += 16;
                explosions.push(new Explosion(this.t, BIGEXPLOSIONIMG, 0.6, 12, {w:192,h:192}, _NOCOLLISION, true));

                for (const bullet of this.player.bullets)
                {
                    bullet.dying = true;
                }
            }
            
            shakeReset = 32;
        
        this.hit = true;
        this.dying = true;
    }

    explode()
    {
        explosions.push(new Explosion(this.t, EXPLOSIONIMG));
        this.hit = true;
        this.dying = true;
    }

    circleCircleA({x,y}, d, radius, e)
    {
        if (this.dying || e.immune > 0)
            return;

        if (!this.SP)
        {
            if (e.hijacked)
            {
                this.t.x = e.center.x-this.t.w*this.direction.x;
                this.t.y = e.center.y-this.t.h*this.direction.y;
                this.hit = true;
                this.dying = true;

                explosions.push(new Explosion(this.t, EXPLOSIONIMG));
                e.hit = true;
                e.dying = true;
                return;
            }
            if (!this.hijacked && this.player.shield)
            {
                this.immune = 12;
                x/=d; y/=d;
                this.angle = Math.atan(y/x);
                if (x < 0) this.angle+=Math.PI;

                this.hijacked = true;
                this.trapped = true;
                this.radius = radius;
                this.c = BulletPIMG;


                this.boss.bullets.splice(this.boss.bullets.indexOf(this),1);
                this.player.bullets.push(this);
            }
        }
        
    }

    updateMore()
    {
        if (this.immune > 0)
            this.immune--;
        if (this.speed <= 0)
            this.dying = true;

        if (this.slowing)
        {
            this.speed-=4;
        }
        if (this.deathCountDown == 0)
        {
            this.active = false;
            display.camShake = 0;
            this.shaking = false;
            return;
        }
        
        if (this.dying && this.deathCountDown > 0)
        {
            if (this.deathCountDown == this.initDC) {this.c = dedBulletIMG; this.r = Math.random()*360}
            this.t.w*=1.1;
            this.t.h*=1.1;
            this.alpha*=0.75
            this.deathCountDown--;
            
            display.camShake = 0.05;

            if (this.hit) return;
        }
        
        if (this.hijacked && this.trapped)
        {
            this.t.x =  Math.cos(this.angle)*(this.radius-this.t.w/4)+ this.player.center.x;
            this.t.y = -Math.sin(this.angle)*(this.radius-this.t.h/4) + this.player.center.y;
            this.angle += (Math.PI/180)*8;
        }
        else
        {
            this.moveBy(this.direction, this.speed);
        }
        this.r = (this.r+30)%360;
        this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};
    }

    render()
    {
        display.drawImg(currentCtx,
        {
            x: this.t.x + (Math.random()-0.5)*this.jitteriness,
            y: this.t.y + (Math.random()-0.5)*this.jitteriness,
            w:this.t.w,h:this.t.h,o:this.t.o
        }, this.c, this.alpha, this.r);
    }
}















class Maurice extends Dynamic
{
    constructor({x,y,w,h,o}, c, collision = _BLOCKALL, player = new Player())
    {
        super("img", {x,y,w,h,o}, c, collision);

        this.boss = true;
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
            this.dmg(128,{x:0,y:0});
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