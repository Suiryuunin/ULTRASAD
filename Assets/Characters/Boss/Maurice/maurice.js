class Bullet extends Dynamic
{
    constructor({x,y,w,h,o}, c, collision = _NOCOLLISION, target)
    {
        super("color", {x,y,w,h,o}, c, collision);

        this.target = target;
        this.t.w = this.t.h = 48;
        this.setDirectionTo({x:target.x, y:target.y});
    }
}

class Maurice extends Dynamic
{
    constructor({x,y,w,h,o}, c, collision = _BLOCKALL, player = new Player())
    {
        super("img", {x,y,w,h,o}, c, collision);

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
                this.bullets.push(new Bullet(this.t, "red", _NOCOLLISION, {x:this.player.center.x, y:this.player.center.y}));
                console.log(this.bullets[0].t.x)
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
        
        for (const bullet of this.bullets)
        {
            if (bullet != undefined)
                bullet.moveBy(bullet.direction, 16);
        }
    }
    renderMore()
    {
        for (const bullet of this.bullets)
        {
            bullet.render();
        }
    }
}