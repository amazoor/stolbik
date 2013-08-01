function Timer() {
    this.delay = 1000;
    this.repeatCount = 0;
    this.date = new Date();
    this.currentTime = 0;
    this.lastTime = 0;
    this.timeInterval = 0;
}

Timer.prototype.start = function (delay, repeatCount, tickCallback, completeCallback) {
    var that = this;
    this.delay = delay;
    this.repeatCount = repeatCount;
    this.tickcallback = tickCallback;
    this.completecallback = completeCallback;
    this.interval = setInterval(function () {
        if (that.repeatCount == -1)
        {
            that.tickcallback(that.repeatCount);
        }
        else
        {
            that.repeatCount -= 1;
            that.tickcallback(that.repeatCount);
            if (that.repeatCount == 0) {
                clearInterval(that.interval);
                that.completecallback();
            }
        }
    }, delay);
}

Timer.prototype.stop = function () {
    clearInterval(this.interval);
    this.completecallback();
}

