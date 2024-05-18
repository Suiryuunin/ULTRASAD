const BulletIMG = new Image();
BulletIMG.src = "Assets/Characters/Boss/Maurice/Textures/bullet.png";

class Bullet extends Dynamic
{
    constructor({x,y,w,h,o}, c, collision = _BLOCKALL, target, boss)
    {
        super("img", {x,y,w,h,o}, c, collision);

        this.target = target;
        this.boss = boss;
        this.dying = false;
        this.deathCountDown = 4;
        this.t.w = this.t.h = 48;
        this.speed = 16;
        this.r = 0;
        this.setDirectionTo({x:target.x, y:target.y});
        this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};
    }

    circleRectA({x,y}, d)
    {
        const m = d/(d-this.t.w/2);
        x/=m;
        y/=m;
        this.t.x = (this.center.x-x)+this.t.w*this.t.o.x+this.t.w/2;
        this.t.y = (this.center.y-y)+this.t.h*this.t.o.y+this.t.h/2;
        this.dying = true;
    }

    updateMore()
    {
        if (this.deathCountDown == 0)
        {
            this.active = false;
            return;
        }
        
        if (this.dying && this.deathCountDown > 0)
        {
            this.deathCountDown--;
            return;
        }
        
        this.moveBy(this.direction, this.speed);
        this.r = (this.r+30)%360;
        this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};
    }

    render()
    {
        display.drawImg(currentCtx, this.t, this.c, 1, this.r);
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
            if (bullet != undefined)
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
            if (this.bullets[i].active)
                this.bullets[i].render();
            else
                this.bullets.splice(i,1);
        }
    }
}