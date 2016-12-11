var ProgressBar = function (selector,length) {
    this.parent = typeof selector === "string" ? document.querySelector(selector) : selector;
    var i=0;
    var height = window.getComputedStyle(this.parent).height;
    var progressItems = this.parent.querySelector(".progress-items")
    for(;i<length;i++) {
        var item = document.createElement("div");

        item.style.display = "inline-block";
        item.style.width = 100 * 1 / length + "%";
        item.style.height = height;
        if(i !== length-1) {
            item.style.borderRight = "1px solid white";
        }
        progressItems.appendChild(item);
    }

    this.progressRate =  this.parent.querySelector(".progress-rate")
}

ProgressBar.prototype={
    to:function (p) {
        console.log(Math.ceil( p*100))
        this.progressRate.style.width =Math.ceil( p*100)+"%";
    }
}

