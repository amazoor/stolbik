function DisplayObject (ctx) {
    this.context = ctx;
    this.id = 0;
    this.x = 0;
    this.y = 0;
    this.width = 100;
    this.height = 100;
    this.src = "/";
    this.loadCallback = null;
    this.image = null;
}

DisplayObject.prototype.setImage = function(source, loadcallback)  {
    this.src = source;
    this.loadCallback = loadcallback;
    this.image = new Image();
    var that = this;
    this.image.onload = function() {
        that.width = that.image.width;
        that.height = that.image.height;
        that.loadCallback();
    }
    this.image.src = this.src;
}

DisplayObject.prototype.draw = function(xPos, yPos) {
    this.x = xPos;
    this.y = yPos;
    this.context.drawImage(this.image, this.x, this.y);
}


