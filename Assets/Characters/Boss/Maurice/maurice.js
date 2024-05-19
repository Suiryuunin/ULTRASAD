const BulletIMG = new Image();
BulletIMG.src = "Assets/Characters/Boss/Maurice/Textures/bullet.png";

const dedBulletIMG = new Image();
dedBulletIMG.src = "Assets/Characters/Boss/Maurice/Textures/dedBullet.png";

class Bullet extends Dynamic
{
    constructor({x,y,w,h,o}, c, collision = _BLOCKALL, target, boss)
    {
        super("img", {x,y,w,h,o}, c, collision);

        this.target = target;
        this.boss = boss;
        this.bullet = true;
        this.player = PLAYER;
        this.dying = false;

        //Player Control
        this.hijacked = false;
        this.trapped = true;
        this.angle = 0;
        this.radius = 128;
        this.hit = false;
        this.immune = 0;

        this.deathCountDown = this.initDC= 12;
        this.t.w = this.t.h = 48;
        this.speed = 16;
        this.slowing = false;
        this.r = 0;
        this.jitteriness = (Math.random()+1)*4;
        this.setDirectionTo({x:target.x, y:target.y});
        this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};
    }

    circleRectA({x,y}, d, e)
    {
        if (this.dying) return;

        if (d == 0) d = 1*(10**-64);
        const m = d/(d-Math.sign(d)*(this.t.w/4));
        x/=m;
        y/=m;
        
        this.t.x = (this.center.x-x)+this.t.w*this.t.o.x+this.t.w/2;
        this.t.y = (this.center.y-y)+this.t.h*this.t.o.y+this.t.h/2;

        if (e.boss) explosions.push(new Explosion(this.t, EXPLOSIONIMG));
        this.hit = true;
        this.dying = true;
    }

    circleCircleA({x,y}, d, radius, e)
    {
        if (this.dying || e.immune > 0)
            return;

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
            return;
        }
        
        if (this.dying && this.deathCountDown > 0)
        {
            if (this.deathCountDown == this.initDC) {this.c = dedBulletIMG; this.r = Math.random()*360}
            this.t.w*=1.1;
            this.t.h*=1.1;
            this.alpha*=0.75
            this.deathCountDown--;
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
        this.player = player;

        this.bulletCooldownTime = this.bulletCooldown = 4;
        this.bulletDuration = 32;
        this.bulletDurationTime = 0;
        this.cooldown = 32;
        this.cooling = 0;
        this.chargeTime = this.charging = 16;
        this.bullets = [];
    }

    update()
    {
        for (const bullet of this.bullets)
        {
            bullet.update();
        }
        
        if (this.cooling == this.cooldown)
        {
            if (this.bulletDurationTime == this.bulletDuration)
            {
                this.bulletDurationTime = 0;
                this.cooling = 0;
            }
            else
            {
                this.bulletDurationTime++;
            }
            
            if (this.bulletCooldown == this.bulletCooldownTime)
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