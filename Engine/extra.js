class Explosion extends Img
{
    constructor({x,y,w,h,o}, c, speed = 0.7, time = 6, size = {w:128,h:128}, collision = _NOCOLLISION)
    {
        super({x,y,w,h,o},c, collision);
        this.t.w = size.w;
        this.t.h = size.h;
        this.speed = speed;
        this.increment = 128;
        this.time = this.initTime = time;
        this.r = Math.random()*360;

        display.camShake = 1;
        display.stacks++;
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
                display.stacks--;
            }
            return;
        }
        this.t.w+=4;
        this.t.h+=4;
        this.alpha*=0.9;
        this.time--;
        if (this.time <= -this.initTime*2) explosions.splice(explosions.indexOf(this), 1);
    }
}