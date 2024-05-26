class Drone extends Dynamic
{
    constructor({x,y,w,h,o}, c, collision = _BLOCKALL, player = new Player(), hp = 32, maxHp = 32, name = "DRONE PRIME", broken = false)
    {
        super("img", {x,y,w,h,o}, c, collision);

        this.boss = true;
        this.name = name;
        this.broken = broken;
        this.hp = hp;
        this.maxHp = maxHp;
        this.player = player;
        this.collideWPlayer = true;

        this.dmgCD = 0;

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
        this.origin = {x,y,w,h,o};
        this.target = {x:0,y:0};
        this.enraged = "";
        this.dying = false;
        this.dead = false;

        this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};

        if (this.broken)
        {
            this.destination = {x:this.center.x,y:this.center.y};
            return;
        }
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

    collideAllA()
    {
        if (!this.dead)
        {
            this.v.y = 0;
        
            explosions.push(new Explosion(this.t, BIGEXPLOSIONIMG, 0.6, 12, {w:192,h:192}, _NOCOLLISION, true));
            this.dead = true;
        }
        
    }

    rotate()
    {
        if (this.player.center.x < this.center.x)
        {
            this.c = _DroneIMG["drone"+this.enraged];
            this.origin.x = this.center.x-36;
            this.origin.y = this.center.y+42;

            let x = this.center.x - this.player.center.x;
            let y = this.center.y - this.player.center.y;
            const d = Math.sqrt(x**2+y**2);

            x/=d; y/=d;
            let angle = Math.atan(y/x);
            this.r = angle/Math.PI*180;

            this.flip.x = 1;
            return;
        }

        this.c = _DroneIMG["drone"+this.enraged];
        this.origin.x = this.center.x+36;
        this.origin.y = this.center.y+42;

        let x = this.center.x - this.player.center.x;
        let y = this.center.y - this.player.center.y;
        const d = Math.sqrt(x**2+y**2);

        x/=d; y/=d;
        let angle = Math.atan(y/x);
        this.r = angle/Math.PI*180;
        
        this.flip.x = -1;
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

        this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};

        if (this.dying)
        {
            this.moveBy(this.direction, 16);
            this.r+=25;
            if (this.isCollidingWith(this.player.t)) this.collideAllA();
            return;
        }

        this.rotate();
        this.moveTowards(this.destination, 0.1);

        if (this.hp <= 0)
        {
            this.die();
        }

        if (this.broken) return;

        if (this.hp <= this.maxHp/2 && this.enraged == "")
        {
            this.bulletCooldownTime/=2;
            this.cooling = 0;
            this.cooldown/=2;
            this.chargeTime/=2;
            this.charge=0;
            this.enraged = "E";
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

                InstanceAudio(_PEWSFX, 0.5).play();
                this.bullets.push(...tempArr);

                currentCtx.FOREGROUNDQUEUE.push(...tempArr);
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

    render()
    {
        if (this.enraged == "E")
            display.drawImg(currentCtx,
            {
                x:this.t.x + (Math.random()-0.5)*8,
                y:this.t.y + (Math.random()-0.5)*8,
                w:this.t.w+32,
                h:this.t.h+32,
                o:this.t.o
            }, _ENRAGEDAURA, 0.5);

        display.drawImg(currentCtx,
            {
                x:this.t.x + (this.enraged == "E" ? (Math.random()-0.5)*8 : 0),
                y:this.t.y + (this.enraged == "E" ? (Math.random()-0.5)*8 : 0),
                w:this.t.w,
                h:this.t.h,
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
    }

    die()
    {
        InstanceAudio(_DEDSFX, 1).play();
        InstanceAudio(_DEDSFX, 1).play();
        InstanceAudio(_DEDSFX, 1).play();

        this.dmg(75,{x:0,y:0});
        display.stacks += 12;
        shakeReset = 64;

        for (const bullet of this.bullets)
            bullet.active = false;

        this.setDirectionTo({x:this.player.center.x, y:this.player.center.y});
        this.dying = true;
    }
}