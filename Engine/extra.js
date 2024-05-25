class Explosion extends Dynamic
{
    constructor({x,y,w,h,o}, c, speed = 0.7, time = 6, size = {w:128,h:128}, collision = _NOCOLLISION, SP = false)
    {
        super("img", {x,y,w,h,o},c, collision);
        this.t.w = size.w;
        this.t.h = size.h;
        this.speed = speed;
        this.increment = size.w;
        this.time = this.initTime = time;
        this.r = Math.random()*360;
        this.center = {x:this.t.x,y:this.t.y};
        this.SP = SP;

        display.camShake = 8;
        shakeReset = shakeDuration;
        display.stacks += 2;
        this.shaking = true;
    }

    updateMore()
    {
        if (this.time > 0)
        {
            this.increment *= this.speed;
            this.t.w += this.increment;
            this.t.h += this.increment;
            this.time--;
            if (this.time == Math.round(this.initTime/2))
            {
                display.camShake = 0;
                this.shaking = false;
            }
            return;
        }
        this.t.w+=4;
        this.t.h+=4;
        this.alpha*=0.9;
        this.time--;
        if (this.time <= -this.initTime*2) explosions.splice(explosions.indexOf(this), 1);
    }

    circleRectA({x, y}, distance, e)
    {
        if (e.hp != undefined)
        {
            e.dmg(this.SP ? 0.15 : 0.1, {x:0,y:0}, true);
        }
    }
}

const BLOODIMG0 = new Image();
BLOODIMG0.src = "Assets/Textures/blood0.png";
const BLOODIMG1 = new Image();
BLOODIMG1.src = "Assets/Textures/blood1.png";
const BLOODIMG2 = new Image();
BLOODIMG2.src = "Assets/Textures/blood2.png";
const BLOODIMGs = [BLOODIMG0, BLOODIMG1, BLOODIMG2];

class Blood extends Physics
{
    constructor({x,y,w,h,o}, size, {vx, vy})
    {
        super("img", {x,y,w,h,o}, BLOODIMGs[Math.round(Math.random()*2)], _NOCOLLISION);
        this.gravityMultiplier = 0.5;
        this.v = {x:vx,y:vy};
        this.t.w+=this.t.w*size;
        this.t.h+=this.t.h*size;
        this.t.w = this.t.h = this.t.w + (Math.random()-0.5)*this.t.w;
        this.w = this.t.w*1;
        this.h = this.t.h*1;
        this.t.w = 0;
        this.t.h = 0;
        this.r = Math.random()*360;
        this.alpha = 0.2;
    }

    collideAllA()
    {
        this.gravityMultiplier = 0;
        this.v = {x:0,y:0};
        this.h *= 0.5;
        this.w *= 0.5;
        this.active = false;
        display.drawImg(currentCtx.BLOODCTX,
        {
            x:this.t.x,
            y:this.t.y,
            w:this.w,
            h:this.h,
            o:this.t.o
        }, this.c, this.alpha, this.r, this.flip.x, this.flip.y);
    }

    collideTopA({y,h,o})
    {
        this.t.y = y-h*o.y+h;
    }
    collideBottomA({y,h,o})
    {
        this.t.y = y+h*o.y+this.t.h/16;
    }
    collideLeftA({x,w,o})
    {
        this.t.x = x+w*o.x+w;
    }
    collideRightA({x,w,o})
    {
        this.t.x = x+w*o.x;
    }
    render()
    {
        display.drawImg(currentCtx, {
            x:this.t.x,
            y:this.t.y,
            w:this.w,
            h:this.h,
            o:this.t.o
        }, this.c, this.alpha, this.r, this.flip.x, this.flip.y);
    }
}

class BloodGenerator
{
    constructor({x,y},count, size, speed, radius = 16, anywhere = false)
    {
        this.particlesLeft = count;
        this.active = true;
        this.t = {x:x,y:y,w:32,h:32,o:{x:-0.5,y:-0.5}};
        this.size = size;
        this.speed = speed;
        this.radius = radius;
        this.anywhere = anywhere;
    }

    update()
    {
        if (this.particlesLeft > 0)
        {
            const spawned = Math.round(Math.random()*this.particlesLeft);
            const toSpawn = spawned == 0 ? 1 : spawned;
            this.particlesLeft-=toSpawn;
            
            for (let i = 0; i < toSpawn; i++)
            {
                const vx = (Math.random()-0.5)*this.speed;
                let vy = 0;
                if (!this.anywhere)
                    vy = Math.sqrt(this.radius**2-vx**2);
                else
                    vy = (Math.random()-0.5)*this.speed;

                currentCtx.BLOOD.push(new Blood(this.t, this.size, {vx:vx, vy:vy}));
            }
            return;
        }
        this.active = false;
    }
}