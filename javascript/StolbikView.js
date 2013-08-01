function StolbikView(controller) {
    this.controller = controller;
    this.model = controller.model;
    this.anim = controller.anim;
    this.canvas = controller.anim.getCanvas();
    this.context = controller.anim.getContext();
    this.showDigit0 = false;
    this.showDigit1 = false;
    this.showDigit2 = false;
    this.hideDigits = false;
}

StolbikView.prototype.drawScreenBG = function () {
    this.controller.images["bg"].draw(0, 0);
}

StolbikView.prototype.drawDigits = function () {
    var d0 = this.controller.images[this.model.digit0];
    var d1 = this.controller.images[this.model.digit1];
    var d2 = this.controller.images[this.model.digit2];
    var hPadding = this.canvas.width * .05;
    var vPadding = this.canvas.height * .05;

    if (this.hideDigits) {
        var matrix = this.model.spinResponce.winMatrix;
        if(matrix == "001") {
            d0.draw(hPadding, vPadding);
            d1.draw(this.canvas.width * .5 - d1.width / 2, vPadding);
        } else if(matrix == "011") {
            d0.draw(hPadding, vPadding);
        }
        else if(matrix == "111") {

        }
    } else {
        d0.draw(hPadding, vPadding);
        d1.draw(this.canvas.width * .5 - d1.width / 2, vPadding);
        d2.draw(this.canvas.width - d2.width - hPadding, vPadding);
    }
}

StolbikView.prototype.drawAnitation = function () {
    if (++this.currentD > 5)
        this.currentD = 0;

    var d0 = this.showDigit0 ? this.controller.images[this.model.digit0] : this.controller.images["da" + this.currentD];
    var d1 = this.showDigit1 ? this.controller.images[this.model.digit1] : this.controller.images["da" + this.currentD];
    var d2 = this.showDigit2 ? this.controller.images[this.model.digit2] : this.controller.images["da" + this.currentD];
    var hPadding = this.canvas.width * .05;
    var vPadding = this.canvas.height * .05;

    d0.draw(hPadding, vPadding);
    d1.draw(this.canvas.width * .5 - d1.width / 2, vPadding);
    d2.draw(this.canvas.width - d2.width - hPadding, vPadding);
}

StolbikView.prototype.drawKeypad = function () {
    var bg = this.controller.images["keypadBG"];
    var spinButton = this.controller.images["spinButton"];
    var paytableButton = this.controller.images["paytableButton"];

    bg.draw(0, this.canvas.height - bg.height);
    spinButton.draw(bg.width * .5 - spinButton.width * .5, canvas.height - bg.height * .5 - spinButton.height * .5)
    paytableButton.draw(bg.width - paytableButton.width - this.canvas.width * .05, canvas.height - bg.height * .5 - paytableButton.height * .5);
}

StolbikView.prototype.updateView = function () {
    this.drawScreenBG();
    this.drawKeypad();
    if (this.model.isSpinning) {
        this.drawAnitation();
    } else {
        this.drawDigits();
    }
    this.drawTexts();
    this.showPaytable();
}

StolbikView.prototype.showPaytable = function () {
    if (this.controller.model.isPaytable) {
        var pt = this.controller.images["paytable"];
        pt.draw(this.canvas.width * .5 - pt.width * .5, this.canvas.height * .5 - pt.height * .5);
    } else {

    }
}

StolbikView.prototype.drawTexts = function () {
    this.context.font = 'bold 30pt Helvetica';
    this.context.fillStyle = 'orange';
    this.context.fillText('WIN:' + this.controller.model.winCoins, this.canvas.width * .05, 560);
    this.context.fillText('COINS:' + this.controller.model.coins, this.canvas.width * .05, 620);
}

StolbikView.prototype.checkClick = function (event) {
    var x = event.clientX;
    var y = event.clientY;
    var spinButton = this.controller.images["spinButton"];
    var paytableButton = this.controller.images["paytableButton"];
    var btnID = "";
    if (x > this.canvas.width * .5 - spinButton.width * .5 &&
        x < this.canvas.width * .5 + spinButton.width * .5 &&
        y > spinButton.y && y < spinButton.y + spinButton.height)
        btnID = "spinButton";
    else if (x > paytableButton.x && x < paytableButton.x + paytableButton.width &&
        y > paytableButton.y && y < paytableButton.y + paytableButton.height)
        btnID = "paytableButton"

    return btnID;
}

StolbikView.prototype.startDigitAnimation = function () {
//    if(this.animTimer) {
//        this.animTimer.stop();
//        this.animTimer = null;
//    }
    this.animTimer = new Timer();
    var that = this;
    var digits = 5;
    this.currentD = 0;
    this.animTimer.start(100, -1, function (ticksLeft) {
        that.updateView();
    }, function () {
        that.controller.spinComplete();
        that.updateView();
    });
}

StolbikView.prototype.showWin = function () {
    this.showDigit0 = false;
    this.showDigit1 = false;
    this.showDigit2 = false;

    var that = this;
    var timer = new Timer();
    timer.start(500, 3, function (tick) {
        if (tick < 1) {
            that.showDigit2 = true;
            if (that.animTimer)
                that.animTimer.stop();
        } else if (tick < 2) {
            that.showDigit1 = true;
        } else {
            that.showDigit0 = true;

        }

    }, function () {
        that.blink();
    });
}

StolbikView.prototype.blink = function () {
    var winMatrix = this.model.spinResponce.winMatrix;
    if (winMatrix == "000") return;

    var blickTimer = new Timer();
    var that = this;
    blickTimer.start(100, 7, function (currentCount) {
        if (currentCount % 2 == 0) {
            that.hideDigits = true;
        } else {
            that.hideDigits = false;
        }
        that.updateView();
    }, function () {
        that.hideDigits = false;
        that.updateView();
    });
}