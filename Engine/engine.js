class Engine
{
    constructor (fps, update, render)
    {
        this.time = 0;
        this.timeStamp = 0;
        this.timeStampR = 0;
        this.delta = 0;
        this.deltaR = 0;
        this.update = update;
        this.render = render;
        this.fps = fps;

        this.run = (time) =>
        {
            this.time = time;
            this.delta = this.time - this.timeStamp;
            this.deltaR = this.time - this.timeStampR;

            if (this.deltaR >= Math.floor(1000 / this.fps))
            {
                this.update();
                this.render();

                this.timeStampR = this.timeStamp = time;
            }
            else if (this.delta >= Math.floor(1000 / 60))
            {
                this.update();
                this.timeStamp = time;
            }

            this.animationRequest = window.requestAnimationFrame(this.run);
        }
    }

    start()
    {
        this.animationRequest = window.requestAnimationFrame(this.run);
    }

    stop()
    {
        window.cancelAnimationFrame(this.animationRequest);
    }
}