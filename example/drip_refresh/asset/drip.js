var Drip = function(selector , r){
    this.canvas = typeof selector === "string" ? document.querySelector(selector) : selector;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "#1d79eb";
    this.x = this.canvas.width / 2;
    this.y = r+1;
    this.r = r;
    this.distance = 0;
    this.drawBigCircle();
    this.drawSmallCircle();
    this.drawTransition();
};

Drip.prototype = {
    drawBigCircle:function(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y,  this.r-this.distance/7, -Math.PI,0, false);


    },
    drawSmallCircle:function(){

       // this.ctx.arc(this.x, this.y+ this.distance,  this.r-this.distance/4, 0,Math.PI, false);


    },
    drawTransition:function(){
        this.ctx.quadraticCurveTo(this.x+this.r-this.distance/4,this.y+this.distance/2,this.x+this.r-this.distance/4,this.y+this.distance);
        this.ctx.arc(this.x, this.y+ this.distance,  this.r-this.distance/4, 0,Math.PI, false);

        this.ctx.quadraticCurveTo(this.x-this.r+this.distance/4,this.y+this.distance/2,this.x-this.r+this.distance/7,this.y);


        this.ctx.closePath();
        this.ctx.fill();
    },
    setDistance:function(d){
        this.distance = d;
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.draw();
    },
    draw:function(){
        if( this.visible === false)return;
        this.drawBigCircle();
        this.drawSmallCircle();
        this.drawTransition();
    },
    hide:function(){
        this.visible = false;
        this.distance = 0;
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

    },
    show:function(){
        this.visible = true;
        this.draw();
    }

};