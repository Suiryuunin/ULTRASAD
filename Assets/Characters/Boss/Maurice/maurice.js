class Bullet extends Dynamic
{
    constructor({x,y,w,h,o}, c, collision = _BLOCKALL, target, boss)
    {
        super("color", {x,y,w,h,o}, c, collision);

        this.target = target;
        this.boss = boss;
        this.dying = false;
        this.deathCountDown = 4;
        this.t.w = this.t.h = 48;
        this.setDirectionTo({x:target.x, y:target.y});
    }

    collideTopA({y,h,o})
    {
        this.t.y = (y+h*o.y)+h - this.t.h*this.t.o.y;
        this.dying = true;
    }
    collideBottomA({y,h,o})
    {
        this.t.y = (y +h*o.y)+this.t.h*this.t.o.y;
        this.dying = true;
    }
    collideLeftA({x,w,o})
    {
        this.t.x = (x+w*o.x)+w - this.t.w*this.t.o.x+0.01;
        this.dying = true;
    }
    collideRightA({x,w,o})
    {
        this.t.x = (x+w*o.x) - this.t.w - this.t.w*this.t.o.x-0.01;
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
        
        this.moveBy(this.direction, 16);
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
                this.bullets.push(new Bullet(this.t, "red", _NOCOLLISION, {x:this.player.center.x, y:this.player.center.y}, this));
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