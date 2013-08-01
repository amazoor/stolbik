function StolbikModel(controller) {
    this.controller = controller;
    this.digit0 = "digit0";
    this.digit1 = "digit0";
    this.digit2 = "digit0";
    this.winCoins = 0;
    this.coins = 0;
    this.winMatrix = "000";
    this.isPaytable = false;
    this.isSpinning = false;

    this.spinResponce = new SpinResponceData();
}

StolbikModel.prototype.init = function() {
    var that = this;
    var request = new XMLHttpRequest();
    request.open('GET', "http://www.amazoor.com/stolbik/php/init_service.php?vk_id="+this.id, true);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var data = JSON.parse(request.responseText);

            that.digit0 = "digit"+data[0];
            that.digit1 = "digit"+data[1];
            that.digit2 = "digit"+data[2];
            that.coins = data[3];
            that.controller.initResponceReceived();
        }
    };
    request.send();
}

StolbikModel.prototype.spin = function() {
    var that = this;
    var request = new XMLHttpRequest();
    request.open('GET', "http://www.amazoor.com/stolbik/php/spin_service.php?vk_id="+this.id, true);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var data = JSON.parse(request.responseText);

            that.digit0 = "digit"+data[0];
            that.digit1 = "digit"+data[1];
            that.digit2 = "digit"+data[2];

            that.spinResponce.winCoins = data[3];
            that.spinResponce.coins = data[5];

            that.winCoins = 0;
            that.winMatrix = data[4];
            that.spinResponce.winMatrix = data[4];
            that.coins = that.coins - 1;
            that.controller.spinResponceReceived();

        }
    };
    request.send();
}

StolbikModel.prototype.showPaytable = function(show) {
    if (show) {
        this.isPaytable = true;
    } else {
        this.isPaytable = false;
    }
}

StolbikModel.prototype.initVK = function() {
    VK.init(function() {
        var parts=document.location.search.substr(1).split("&");
        var flashVars={}, curr;
        for (i=0; i<parts.length; i++) {
            curr = parts[i].split('=');
            // записываем в массив flashVars значения. Например: flashVars['viewer_id'] = 1;
            flashVars[curr[0]] = curr[1];
        }

        viewer_id = flashVars['viewer_id'];
        StolbikModel.prototype.id = viewer_id;
    });
}

StolbikModel.prototype.getUsrInfo = function() {
    VK.api("getProfiles", {uids:viewer_id,fields:"photo_big, sex"}, function(data) {
        var firstname = data.response[0].first_name;
        var lastname = data.response[0].last_name;
        var id = this.viewer_id;
        var sex = data.response[0].sex;
        var request = new XMLHttpRequest();
        var url = "http://www.amazoor.com/stolbik/php/database.php";
        var params = "vk_id="+id+"&"+"firstname="+firstname+"&"+"lastname="+lastname+"&"+"sex="+sex;
        StolbikModel.prototype.firstname = firstname;
        StolbikModel.prototype.lastname = lastname;
        StolbikModel.prototype.sex = sex;
        request.onreadystatechange = function() {
            if(request.readyState == 4 && request.status == 200) {

            }
        }
        request.open('GET', url+"?"+params, true);
        request.send();
    });
}