var Drip = function (selector, r) {
    this.canvas = typeof selector === "string" ? document.querySelector(selector) : selector;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "#1d79eb";
    this.x = 0;
    this.y =  1;
    this.r = r;
    this.distance = 0;
  
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.stateMapping = { "loading": "loading", "toLoading": "toLoading", "drip": "drip" };
    this.state = this.stateMapping.drip;  
    this.ctx.translate(this.width / 2, this.width / 2);
  
    this.rotationStep = 30 * Math.PI / 180;
    this.rotation = 0;

};

Drip.prototype = {
    draw: function () {
        if (this.visible === false) return;
        this.clear();
        if (this.state === this.stateMapping.drip) {
            this.drawDrip();
        } else if (this.state === this.stateMapping.loading) {
            this.ctx.globalAlpha = 1;

            this.drawLoading();
        } if (this.state === this.stateMapping.toLoading) {
            this.distance -= 5;
            this.ctx.globalAlpha -= 0.05;
            if (this.ctx.globalAlpha <= 0.2) {
                this.ctx.globalAlpha = 0;
                this.state = this.stateMapping.loading
                clearInterval(this.tickId);
                this.tick(150);

            }


            this.drawFadingDrip();
        }
    },
    clear: function () {

        this.ctx.clearRect(this.width / -2, this.width / -2, this.width, this.height);
    },
    drawDrip: function () {

        var ctx = this.ctx
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r - this.distance / 7, -Math.PI, 0, false);
        ctx.quadraticCurveTo(this.x + this.r - this.distance / 4, this.y + this.distance / 2, this.x + this.r - this.distance / 4, this.y + this.distance);
        ctx.arc(this.x, this.y + this.distance, this.r - this.distance / 4, 0, Math.PI, false);
        ctx.quadraticCurveTo(this.x - this.r + this.distance / 4, this.y + this.distance / 2, this.x - this.r + this.distance / 7, this.y);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    },
    drawFadingDrip: function () {
        var ctx = this.ctx
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r - this.dr1, -Math.PI, 0, false);
        ctx.quadraticCurveTo(this.x + this.r - this.dr2, this.y + this.distance / 2, this.x + this.r - this.dr2, this.y + this.distance);
        ctx.arc(this.x, this.y + this.distance, this.r - this.dr2, 0, Math.PI, false);
        ctx.quadraticCurveTo(this.x - this.r + this.dr2, this.y + this.distance / 2, this.x - this.r + this.dr1, this.y);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

    },
    tick: function (interval) {

        this.tickId = setInterval(function () {
            this.draw();
        }.bind(this), interval);
    },
    drawLoading: function () {

        var ctx = this.ctx;
        this.clear();
        ctx.save();
        this.rotation += this.rotationStep;
        ctx.rotate(this.rotation);	// Rotate the origin
        for (var i = 0; i < 12; i++) {
            ctx.rotate(Math.PI * 2 / 12);	// Rotate the origin
            ctx.strokeStyle = "rgba(0,111,255," + i / 12 + ")";	// Set transparency
            ctx.beginPath();
            ctx.moveTo(0, 10);
            ctx.lineTo(0, 16);
            ctx.stroke();
        }
        ctx.restore();

    },

    setDistance: function (d) {
        this.distance = d;
        this.draw();
    },
    hide: function () {
        this.visible = false;
        clearInterval(this.tickId);
        this.distance = 0;
        this.clear();
    },
    show: function () {
        this.visible = true;
        this.ctx.globalAlpha = 1;
        this.state = this.stateMapping.drip;
        this.draw();
    },
    toLoading: function () {
        this.state = this.stateMapping.toLoading;
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = "round";

        this.dr1 = this.distance / 7;

        this.dr2 = this.distance / 4;
        this.tick(15);

    },
    toDrip: function () {
        clearInterval(this.tickId);
    }

};