var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = 1000;
canvas.height = 600;

var reelData0 = createReelData();
var reelData1 = createReelData();
var reelData2 = createReelData();
var reelData3 = createReelData();
var reelData4 = createReelData();
var rd = [reelData0, reelData1, reelData2, reelData3, reelData4];
var yPos = 0;
var intervalID = -1;
var isSpin = false;
var step = 1;
var MAX_SPEED = 35;
const REEL_COUNT = 5;

window.onload = function() { 
	for (var i = 0; i < REEL_COUNT; i++) {
		drawReel(i, 0, false);
	}
	drawGamePanel();
	drawButton();
	
};

canvas.addEventListener('click', onCanvasClick);

function onCanvasClick(event) {	

		if (isSpin) {
			isSpin = false;
			clearInterval(intervalID);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for (var i = 0; i < 5; i++) {
				drawReel(i, 0, false);
				}
				drawGamePanel();
				drawButton();
				drawGlass();
		} else {
			intervalID = setInterval(startGame, 30);
			isSpin = true;
		}

}

function startGame() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	step++;
	if (step > MAX_SPEED) step = MAX_SPEED;
	var p = step;
	yPos += p;
	
	if (yPos > 160) {
		reelData0.pop();
		reelData1.pop();
		reelData2.pop();
		reelData3.pop();
		reelData4.pop();
		reelData0.unshift(Math.ceil(Math.random() * 7));		
 		reelData1.unshift(Math.ceil(Math.random() * 7));
 		reelData2.unshift(Math.ceil(Math.random() * 7));
 		reelData3.unshift(Math.ceil(Math.random() * 7));
 		reelData4.unshift(Math.ceil(Math.random() * 7));
 		yPos = 0;
	}

	for (var i = 0; i < REEL_COUNT; i++) {
		drawReel(i, yPos, true);
	}
}

function drawReel(reelID, yPos, isBlur) {
	for(var i = 0; i < 4; i++) {
		var img = new Image();
		img.src = "images/symbols/sym"+rd[reelID][i]+".png";
		ctx.drawImage(img, reelID * img.width, (i * img.height + yPos) - img.height);
	}	

	drawGamePanel();
	drawButton();
}

function drawButton() {
	var spinButton = new Image();
	spinButton.src = "images/spin.png";
	ctx.drawImage(spinButton, canvas.width / 2 - spinButton.width / 2, 500)
}

function createReelData() {
	var reelData = [];

	for (var i = 0; i < 4; i++) {
	  reelData[i] = Math.ceil(Math.random() * 7);
	}
	
	return reelData;
}

function drawGamePanel() {
	var panel = new Image();
	panel.src = "images/gamepanel.png";
	ctx.drawImage(panel, 0, 480)	
}
