class Sword extends Dynamic
{
    constructor(player, c)
    {
        super("img", player.t, c, _NOCOLLISION)

        this.directionY = 0;
        this.directionDuration = 20;
        this.directionTime =
        {
            "KeyW": this.directionDuration,
            "KeyS": this.directionDuration
        };
        this.directions =
        {
            "KeyW": -1,
            "KeyS": 1
        };
        this.keys =
        {
            "KeyW": false,
            "KeyS": false
        };

        this.player = player;

        this.idle = true;
        this.delay = 4;
        this.delayC = 0;
        this.frame = 0;
        this.roS = {x:0,y:0}
        this.sinRo = Math.PI/3;
        this.sinRoS = Math.PI/3*2;

        this.stabbing = false;
        this.stabbingTime = this.stabbingTimeLeft = 4;
        this.stabCooldown = this.stabCooling = 8;
        this.stabStep = {x:0,y:0};
        this.justStoppedStabbing = false;
        this.chargingStab = false;
        this.maxStabCharge = 128;
        this.stabCharge = 0;

        this.chargeQueued = false;
        
        this.t.w = 16;
        this.t.h = 128;
        this.t.o = {x:-0.5,y:-1};
        this.r = 70;
        this.destination = this.st = this.t;

        this.auraInitHeight = 160;
        this.swordAura = new Img(
        {
            x:this.t.x,
            y:this.t.y,
            w:64,
            h:this.auraInitHeight,
            o:this.st.o
        }, _SwordAuraImg);

        this.hitbox = new Dynamic("color",
        {
            x:this.t.x,
            y:this.t.y,
            w:64,
            h:this.auraInitHeight,
            o:this.st.o
        }, "red", _NOCOLLISION);
        this.hitbox.alpha = 0;
        this.hitbox.active = false;
        this.hitbox.sword = this;
        this.hitbox.hitList = [];
        this.hitbox.direction = "x";
        this.hitbox.directionY = 0;
        this.hitbox.updateMore = function()
        {
            if (!this.active)
            {
                this.t =
                {
                    x: this.sword.t.x,
                    y: this.sword.t.y,
                    w: 0,
                    h: 0,
                    o: {x:-0.5, y:-0.5}
                };
                return;
            }
            let ox = -1; 
            if (this.sword.player.frozenDirection > 0)
                ox = 0;
            let oy = -1; 
            if (this.directionY > 0)
                oy = 0;

            this.t =
            {
                x: this.sword.t.x,
                y: this.sword.t.y,
                w: this.directionY != 0 ? this.sword.swordAura.t.w : this.sword.swordAura.t.h,
                h: this.directionY != 0 ? this.sword.swordAura.t.h : this.sword.swordAura.t.w,
                o: this.directionY != 0 ? {x:this.sword.st.o.x, y:oy} : {x:ox, y:this.sword.st.o.x}
            };
            
            this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};
        };
        this.hitbox.hit = function()
        {
            let element = {};
            switch(this.direction)
            {
                case "x":
                {
                    let distances = [];
                    for (const e of this.hitList)
                    {
                        distances.push(Math.abs(this.center.x - e.center.x));
                    }
                    const closest = Math.min(...distances);
                    element = this.hitList[distances.indexOf(closest)];

                    break;
                }
                case "y":
                {
                    let distances = [];
                    for (const e of this.hitList)
                    {
                        distances.push(Math.abs(this.center.y - e.center.y));
                    }
                    const closest = Math.min(...distances);
                    element = this.hitList[distances.indexOf(closest)];

                    break;
                }
                default:
                    console.log("WHAT!??");
            }
            if (element == undefined)
                return;

            if (element.hp != undefined)
            {
                const dmg = this.sword.lastStabCharge == this.sword.maxStabCharge ? 15 : this.sword.lastStabCharge/16;
                element.dmg(dmg, {x:0,y:0});
                engine.stopQueued = dmg/15*500;
                this.sword.player.hp += (this.sword.lastStabCharge == this.sword.maxStabCharge ? 15 : this.sword.lastStabCharge/16)/15*(this.sword.player.maxHp-this.sword.player.hp - this.sword.player.hardDmg);
            }

            this.hitList = [];
        };

        const cP = "Assets/Characters/Player/charge/charge000";
        const frames = [];
        for (let i = 0; i < 9; i++)
        {
            frames.push(cP+i+".png");
        }
        this.chargeAni = [new Rect("ani", this.t, frames, _NOCOLLISION), new Rect("ani", this.t, frames, _NOCOLLISION, 2),new Rect("ani", this.t, frames, _NOCOLLISION,5)];
        this.chargeConcentration = 1;

        this.clicking = false;

        window.addEventListener("mousedown", () =>
        {
            if (this.keys["KeyJ"] || this.clicking)
                return;
            this.keys["KeyJ"] = true;

            if (this.stabCooldown == this.stabCooling)
            {
                this.t.o = this.st.o = {x:-0.5, y:0};
                this.chargingStab = true;
                this.player.shield = true;
                return;
            }
            this.chargeQueued = true;
        });

        window.addEventListener("mouseup", () =>
        {
            if (!this.keys["KeyJ"] || this.clicking)
                return;
            this.keys["KeyJ"] = false;
            
            if (this.stabCooldown == this.stabCooling)
                this.stab();

            if (this.chargeQueued)
                this.chargeQueued = false;
        });

        window.addEventListener(("keydown"), (e) =>
        {
            if (this.keys[e.code] || this.clicking)
                return;
            this.keys[e.code] = true;

            if (e.code == "KeyJ")
            {
                if (this.stabCooldown == this.stabCooling)
                {
                    this.t.o = this.st.o = {x:-0.5, y:0};
                    this.chargingStab = true;
                    this.player.shield = true;
                    return;
                }
                this.chargeQueued = true;
                return;
            }

            if (this.directions[e.code] != undefined)
            {
                if (this.directionTime[e.code] == this.directionDuration)
                    this.directionTime[e.code] = 0;
                this.directionY += this.directions[e.code];
            }
        });

        window.addEventListener("keyup", (e) =>
        {
            if (!this.keys[e.code] || this.clicking)
                return;
            this.keys[e.code] = false;

            if (e.code == "KeyJ")
            {
                if (this.stabCooldown == this.stabCooling)
                    this.stab();

                if (this.chargeQueued)
                    this.chargeQueued = false;
                return;
            }

            if (this.directions[e.code] != undefined)
            {
                this.directionY -= this.directions[e.code];
                this.directionTime[e.code] = this.directionDuration;
            }
        });
    }

    charge()
    {
        this.idle = false;
        if (this.stabCharge < this.maxStabCharge)
        {
            this.stabCharge++;
            this.lastStabCharge = this.stabCharge;
            this.chargeConcentration = Math.floor(this.stabCharge/(this.maxStabCharge/this.chargeAni.length));
            if (this.chargeConcentration < 1) this.chargeConcentration = 1;
        }

        this.r = -this.player.frozenDirection * 80;
        this.t.x = this.player.center.x + -this.player.frozenDirection * 48 + ((Math.random()-0.5)*this.stabCharge/16);
        this.t.y = this.player.t.y - 16 + ((Math.random()-0.5)*this.stabCharge/16);

        this.flip.x = this.player.frozenDirection;

        for (let i = 0; i < this.chargeConcentration; i++)
        {
            this.chargeAni[i].flip.x = this.player.frozenDirection;
            this.chargeAni[i].t =
            {
                x:this.t.x + this.player.frozenDirection * 32 + ((Math.random()-0.5)*this.stabCharge/8),
                y:this.t.y + ((Math.random()-0.5)*this.stabCharge/8),
                w:128,
                h:128,
                o:{x:-0.5,y:-0.5}
            }
        }
        
    }

    stab()
    {
        this.stabbing = true;
        this.chargingStab = false;
        this.stabCooling = 0;
        this.stabbingTimeLeft = 0;
        this.swordAura.t.h += this.stabCharge/this.maxStabCharge*this.swordAura.t.h;
        this.swordAura.peakH = this.swordAura.t.h;
        this.hitbox.direction = this.directionY == 0 ? "x" : "y";
        this.hitbox.directionY = this.directionY;

        this.player.shield = false;
        for (const bullet of this.player.bullets)
        {
            if (bullet.trapped)
            {
                bullet.trapped = false;
                bullet.speed = 64;
                bullet.slowing = true;
                bullet.direction = 
                {
                    x:  Math.cos(bullet.angle),
                    y: -Math.sin(bullet.angle)
                };
                bullet.immune = 0;
            }
        }
        
        if (this.directionY == 0)
        {
            let ox = -1; 
            if (this.player.frozenDirection > 0)
                ox = 0;
            this.destination =
            {
                x: this.player.center.x + this.player.frozenDirection * 48,
                y: this.player.center.y,
                w: 128,
                h: 16,
                o: {x:ox,y:-0.5}
            }
            this.st.o.y = 0;
            this.r = 90*-this.player.frozenDirection;
            return;
        }

        let oy = -1; 
        if (this.directionY > 0)
            oy = 0;
        this.destination =
        {
            x: this.player.center.x,
            y: this.player.center.y + this.directionY * 64,
            w: 16,
            h: 128,
            o: {x:-0.5,y:oy}
        }
        this.st.o.y = 0;
        this.r = oy*180;
    }

    keyDuration()
    {
        if (this.directionTime["KeyW"] < this.directionDuration)
        {
            this.directionTime["KeyW"]++;
            if (this.directionTime["KeyW"] == this.directionDuration)
            {
                this.keys["KeyW"] = false;
                this.directionY -= this.directions["KeyW"];
            }
        }
        if (this.directionTime["KeyS"] < this.directionDuration)
        {
            this.directionTime["KeyS"]++;
            if (this.directionTime["KeyS"] == this.directionDuration)
            {
                this.keys["KeyS"] = false;
                this.directionY -= this.directions["KeyS"];
            }
        }
    }

    update()
    {
        this.setOldTransform();

        // Up and Down attacks
        this.keyDuration();

        this.hitbox.update();

        // Charge
        if (this.chargingStab)
        {
            this.charge();
            return;
        }

        // Start charging if cooldown over while pressing
        if (this.stabCooldown == this.stabCooling && this.chargeQueued)
        {
            this.t.o = this.st.o = {x:-0.5, y:0};
            this.chargingStab = true;
            this.player.shield = true;
            this.chargeQueued = false;
        }
        
        // Start cooldown after stabbing duration complete
        if (this.stabCooling < this.stabCooldown && this.stabbingTimeLeft == this.stabbingTime)
            this.stabCooling++;

        // Stabbing
        if (this.stabbing)
        {
            this.t.x = this.player.center.x;
            this.t.y = this.player.center.y;
            this.stabStep = {x:(this.destination.x-this.t.x)/this.stabbingTime,y:(this.destination.y-this.t.y)/this.stabbingTime};
            this.stabbing = false;
            return;
        }
        if (this.stabbingTimeLeft < this.stabbingTime)
        {
            if (this.stabbingTimeLeft == 1) 
                this.hitbox.active = true;
            this.stabbingTimeLeft++;
            this.moveBy(this.stabStep);
            
            if (this.stabbingTimeLeft == this.stabbingTime)
            {
                this.stabCharge = 0;
                this.hitbox.active = false;
                this.hitbox.hit();
                this.swordAura.t.h = this.auraInitHeight;
                this.justStoppedStabbing = true;
            }
            return;
        }
        if (this.justStoppedStabbing)
        {
            this.t.w = 16;
            this.t.h = 128;
            this.t.o = this.st.o = {x:-0.5,y:-1};
            this.justStoppedStabbing = false;
        }
        this.idle = true;
        this.r = this.player.frozenDirection * 80;
        this.t.x = this.player.t.x + -this.player.frozenDirection * 160;
        this.t.y = this.player.t.y + 64;
    }
    render()
    {
        this.swordAura.t =
        {
            x:this.t.x,
            y:this.t.y,
            w:this.swordAura.t.w,
            h:this.swordAura.t.h,
            o:this.st.o
        };

        if (this.stabbingTimeLeft < this.stabbingTime)
            display.drawImg(currentCtx,this.swordAura.t, this.swordAura.c, 0.8, this.r);

        display.drawImg(currentCtx,
        {
            x:this.t.x,
            y:this.t.y,
            w:this.st.w,
            h:this.st.h,
            o:this.st.o
        }, this.c, 1, this.r);

        if (this.chargingStab)
        {
            for (let i = 0; i < this.chargeConcentration; i++)
                this.chargeAni[i].render();
        }

        if (this.renderMore != undefined)
            this.renderMore();
    }

    renderMore()
    {
        this.ro.y = (Math.sin(this.sinRo)-0.5)*4;
        this.roS.y = (Math.sin(this.sinRoS)-0.5)*4;
        this.sinRo+=Math.PI/engine.fps;
        this.sinRoS+=Math.PI/engine.fps;

        // Hand Shield
        const transformS = 
        {
            x:this.t.x + (this.chargingStab ? 108*this.player.frozenDirection : (this.idle ? 116*this.player.frozenDirection : 0))+this.ro.x,
            y:this.t.y - (this.chargingStab ? 48 : (this.idle ? -16 : 0))+this.roS.y,
            w:64/2,
            h:128/2,
            o:this.st.o
        };
        display.drawImg(currentCtx, transformS, this.player.frameSet[this.frame], this.player.alpha, this.player.r, this.player.flip.x, this.player.flip.y);

        // Hand Sword
        const transform = 
        {
            x:this.t.x + (this.idle ? 216*this.player.frozenDirection : 0),
            y:this.t.y - (this.idle ? 8 : 32)+this.ro.y,
            w:64/2,
            h:128/2,
            o:this.st.o
        };
        display.drawImg(currentCtx, transform, this.player.frameSet[this.frame], this.player.alpha, this.player.r, this.player.flip.x, this.player.flip.y);

        this.delayC++;
        if (this.delayC == this.delay*engine.fps/30)
        {
            this.frame = (this.frame+1)%this.player.frameSet.length;
            this.delayC = 0;
        }
    }
}