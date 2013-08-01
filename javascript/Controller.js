function Controller(canvasId) {
    this.imageSources = {
        digit0: "images/digits/d0.png",
        digit1: "images/digits/d1.png",
        digit2: "images/digits/d2.png",
        digit3: "images/digits/d3.png",
        digit4: "images/digits/d4.png",
        digit5: "images/digits/d5.png",
        digit6: "images/digits/d6.png",
        digit7: "images/digits/d7.png",
        digit8: "images/digits/d8.png",
        digit9: "images/digits/d9.png",
        da0: "images/digits_a/da0.png",
        da1: "images/digits_a/da1.png",
        da2: "images/digits_a/da2.png",
        da3: "images/digits_a/da3.png",
        da4: "images/digits_a/da4.png",
        da5: "images/digits_a/da5.png",
        spinButton: "images/spin.png",
        spinButtonDisable: "images/spin_disable.png",
        paytable: "images/paytable.png",
        paytableButton: "images/paytable_button.png",
        keypadBG: "images/keypad_bg.png",
        bg: "images/bg.png",
        spinButtonOver: "images/spin_over.png"
    };

    this.images = {};

    this.states = {
        IDLE: "IDLE",
        WIN: "WIN",
        SPIN: "SPIN"
    };

    this.anim = new Animation(canvasId);
    this.model = new StolbikModel(this);
    this.view = new StolbikView(this);

    this.id = null;

    this.loadImages();
    this.addClickListeners();
}

Controller.prototype.loadImages = function () {
    this.view.canvas.style.background = "url('../images/bg_load.png')";
    var that = this;

    var loadedImages = 0;
    var totalImages = 0;
    for (var image in this.imageSources) {
        totalImages++;
    }

    for (var src in this.imageSources) {
        this.images[src] = new DisplayObject(this.anim.getContext());
        this.images[src].setImage(this.imageSources[src], function () {
            if (++loadedImages >= totalImages) {
                that.initGame();
            }
        });
    }
}

Controller.prototype.initGame = function () {
    this.model.init();
}

Controller.prototype.spinResponceReceived = function () {
    this.view.showWin();
}

Controller.prototype.spinComplete = function () {
    this.model.isSpinning = false;
    this.model.coins = this.model.spinResponce.coins;
    this.model.winCoins = this.model.spinResponce.winCoins;
    this.view.updateView();
}

Controller.prototype.initResponceReceived = function () {
    this.view.updateView();
}

Controller.prototype.addClickListeners = function () {
    var that = this;
    this.anim.getCanvas().onclick = function (event) {
        if (that.model.isPaytable) {
            that.model.showPaytable(false);
            that.view.updateView();
            return;
        }

        var target = that.view.checkClick(event);
        switch (target) {
            case "spinButton":
                if (!that.model.isSpinning) {
                    that.model.isSpinning = true;
                    that.view.startDigitAnimation();
                    that.model.spin();
                }
                break;

            case "paytableButton":
                that.model.showPaytable(true);
                that.view.updateView();
                break;
        }
    }
}
