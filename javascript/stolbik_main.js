var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 650;
const SPIN_SERVICE = "http://www.amazoor.com/stolbik/php/spin_service.php";
var images = {};
var interval = -1;
var isSpinning = false;
var index = 0;
var tCounter = 0;
var spinButton;
var spinResponce = new Object();
var isPaytable = false;

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
    paytableButton: "images/paytable_button.png"

};

window.onload = function () {
    spinResponce.d0 = "digit0";
    spinResponce.d1 = "digit0";
    spinResponce.d2 = "digit0";

    loadImages();
};

function loadImages() {
    var loadedImages = 0;
    var totalImages = 0;

    for (var src in this.imageSources) {
        totalImages++;
    }

    for (var src in this.imageSources) {
        this.images[src] = new Image();
        this.images[src].onload = function () {
            if (++loadedImages >= totalImages) {
                loadGame();
            }
        }
        this.images[src].src = this.imageSources[src];
    }
}

function loadGame() {
    drawStartScreen();
    canvas.addEventListener("click", onCanvasClick);
}

function onCanvasClick(event) {
    var centerX = canvas.width / 2;
    if (isPaytable) {
        drawStartScreen();
        isPaytable = false;
        return;
    } else if (event.clientY > canvas.height - spinButton.height &&
        event.clientX > centerX - spinButton.width / 2 &&
        event.clientX < centerX + spinButton.width / 2) {
        onSpinButtonClick();
    } else if (event.clientX > canvas.width - ptButton.width && event.clientY > canvas.height - 100) {
        onPaytableButtonClick();
        showPaytable();
        isPaytable = true;
    }
}


function onSpinButtonClick() {
    getSpinResult();
}

function spin() {
    if (isSpinning) return;

    showSpinButton();
    isSpinning = true;
    showDigitWinAnimation();

    setTimeout(function () {
        clearInterval(interval);
        drawStartScreen();

        blink();
    }, 2000);
}

function showPaytable() {
    var p = images["paytable"];
    ctx.drawImage(p, canvas.width *.5 - p.width*.5, canvas.height / 2 - p.height / 2);
}



function showSpinButton() {
    if (isSpinning) {
        spinButton = this.images["spinButtonDisable"];
    } else {
        spinButton = this.images["spinButton"];
    }

    ctx.drawImage(spinButton, canvas.width * .5 - spinButton.width * .5, canvas.height - spinButton.height);
}

function showDigitWinAnimation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height / 2);

    tCounter++;
    if (tCounter < 10) {
        drawDigits("da" + index, "da" + index, "da" + index);
    } else if (tCounter < 20) {
        drawDigits(spinResponce.d0, "da" + index, "da" + index);
    }
    else if (tCounter < 29) {
        drawDigits(spinResponce.d0, spinResponce.d1, "da" + index);
    } else {
        drawDigits(spinResponce.d0, spinResponce.d1, spinResponce.d2);
    }

    if (++index > 5) index = 0;
}

function showDigitAnimation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height / 2);
    drawDigits("da" + index, "da" + index, "da" + index);
    if (++index > 5) index = 0;
}

function drawStartScreen() {
    clear();
    drawDigits(spinResponce.d0, spinResponce.d1, spinResponce.d2);
    showSpinButton();
    drawPaytableButton();
}

function drawDigits(dig0, dig1, dig2) {
    var d0 = this.images[dig0];
    var d1 = this.images[dig1];
    var d2 = this.images[dig2];

    ctx.drawImage(d0, 20, 30);
    ctx.drawImage(d1, canvas.width / 2 - d1.width / 2, 30);
    ctx.drawImage(d2, canvas.width - 20 - d2.width, 30);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

var ptButton;
function drawPaytableButton() {
    ptButton = images["paytableButton"];
    ctx.drawImage(ptButton, canvas.width - ptButton.width, canvas.height - ptButton.height);
}

function blink() {
    //clear();
    var interval;
    var ind = 0;
    interval = setInterval(function () {
        ind++;
        if (ind % 2 == 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height / 2);
        } else {
            drawDigits(spinResponce.d0, spinResponce.d1, spinResponce.d2);
        }
        showSpinButton();
    }, 200);

    setTimeout(function () {
        isSpinning = false;
        tCounter = 0;
        clearInterval(interval);
        drawStartScreen();
    }, 1000);
}

function getSpinResult() {
    interval = setInterval(showDigitAnimation, 100);

    var request = new XMLHttpRequest();
    request.open('GET', SPIN_SERVICE, true);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var response = request.responseText;
            var data = JSON.parse(response);

            spinResponce.d0 = "digit"+data[0];
            spinResponce.d1 = "digit"+data[1];
            spinResponce.d2 = "digit"+data[2];
            spinResponce.win = data[3];
            spinResponce.winMatrix = data[4];

            trace(spinResponce.win + " " + spinResponce.winMatrix);
            tCounter = 0;

            spin();
        }
    };
    request.send();
}

function trace(string) {
    document.getElementById("textField").innerHTML = string;
}

/* **************      _____      ***************** */
/* **************      MODEL      ***************** */
/* **************      _____      ***************** */
/* **************      _____      ***************** */










