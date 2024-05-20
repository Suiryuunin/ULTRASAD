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

    circleRectA({x:distX, y:distY}, distance, e)
    {
        if (e.hp != undefined)
        {
            e.dmg(this.SP ? 0.15 : 0.1);
        }
    }
}