class Drone extends Dynamic
{
    constructor({x,y,w,h,o}, c, collision = _BLOCKALL, player = new Player())
    {
        super("img", {x,y,w,h,o}, c, collision);

        this.boss = true;
        this.name = "DRONE PRIME"
        this.hp = this.maxHp = 32;
        this.player = player;
        this.range = 
        {
            x1:256, x2:res.w-256,
            y1:(this.t.y-256 < 256 ? 256 : this.t.y-256), y2: (this.t.y-256 < 256 ? 256 : this.t.y-256)+512
        };

        this.bulletDuration = 16;
        this.bulletDurationTime = 0;
        this.cooldown = 32;
        this.cooling = 0;
        
        this.bullets = [];
        this.target = {x:0,y:0};
        this.enraged = false;
        this.dying = false;
        this.dead = false;

        this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};

        // Set new destination
        let _x = 0;
            
        // Avoid Drone from trying to go into the same corner
        do {
            _x = this.center.x+(Math.random()-0.5)*512;
            _x = (_x > this.range.x2 ? this.range.x2 : (_x < this.range.x1 ? this.range.x1 : _x));
        }
        while (_x == this.range.x1 || _x == this.range.x2);

        let _y = 0;
        
        // Avoid Drone from trying to go into the same corner
        do {
            _y = this.center.y+(Math.random()-0.5)*512;
            _y = (_y > this.range.y2 ? this.range.y2 : (_y < this.range.y1 ? this.range.y1 : _y));
        }
        while (_y == this.range.y1 || _y == this.range.y2)
        
        this.destination = {x:_x, y:_y};
    }

    dmg(dmg, {x,y}, explosion = false)
    {
        this.hp -= dmg;
        if (explosion)
            BLOODGENERATORS.push(new BloodGenerator({x:this.center.x,y:this.center.y}, dmg*12, 0.7, 10,12, true));
        else
            BLOODGENERATORS.push(new BloodGenerator({x:this.center.x,y:this.center.y}, dmg*12, 0.7, 10,12));
    }

    collideAllA({y,h,o})
    {
        if (!this.dead)
        {
            this.v.y = 0;
        
            explosions.push(new Explosion(this.t, BIGEXPLOSIONIMG, 0.6, 12, {w:192,h:192}, _NOCOLLISION, true));
            this.dead = true;
        }
        
    }

    update()
    {
        this.setOldTransform();

        for (const bullet of this.bullets)
        {
            bullet.update();
        }

        this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};

        if (this.dying)
        {
            this.moveBy(this.direction, 16);
            this.r+=25;
            return;
        }

        this.moveTowards(this.destination, 0.1);

        if (this.hp <= 0)
        {
            this.dmg(75,{x:0,y:0});
            display.stacks += 12;
            shakeReset = 64;

            this.setDirectionTo({x:this.player.center.x, y:this.player.center.y});
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
            if (this.bulletDurationTime >= this.bulletDuration)
            {
                this.bulletDurationTime = 0;
                let tempArr = [];

                tempArr.push(new Bullet(this.t, _BulletIMG, _NOCOLLISION, {x:this.player.center.x, y:this.player.center.y}, this));

                const x = this.player.center.x - this.center.x;
                const y = this.player.center.y - this.center.y;
                let angle = Math.atan(y/x);
                if (x < 0) angle+=Math.PI;

                angle *= -1;
                angle -= Math.PI/16;

                tempArr.push(new Bullet(this.t, _BulletIMG, _NOCOLLISION,
                {
                    x: Math.cos(angle)+ this.center.x,
                    y:-Math.sin(angle)+ this.center.y
                }, this));

                angle += Math.PI/8;

                tempArr.push(new Bullet(this.t, _BulletIMG, _NOCOLLISION,
                {
                    x: Math.cos(angle)+ this.center.x,
                    y:-Math.sin(angle)+ this.center.y
                }, this));

                this.bullets.push(...tempArr);

                FOREGROUNDQUEUE.push(...tempArr);
                this.cooling = 0;
            }
            else
            {
                this.bulletDurationTime++;
            }
            
            return;
        }
        if (this.cooling == 0)
        {
            // Set new destination
            let x = 0;
            
            // Avoid Drone from trying to go into the same corner
            do {
                x = this.center.x+(Math.random()-0.5)*512;
                x = (x > this.range.x2 ? this.range.x2 : (x < this.range.x1 ? this.range.x1 : x));
            }
            while (x == this.range.x1 || x == this.range.x2);

            let y = 0;
            
            // Avoid Drone from trying to go into the same corner
            do {
                y = this.center.y+(Math.random()-0.5)*512;
                y = (y > this.range.y2 ? this.range.y2 : (y < this.range.y1 ? this.range.y1 : y));
            }
            while (y == this.range.y1 || y == this.range.y2)
            
            this.destination = {x:x, y:y};
        }
        this.cooling++;
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
    }
}