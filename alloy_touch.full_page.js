;(function () {

    var addEvent =  function(el, type, fn, capture) {
        if (type === "mousewheel" && document.mozHidden !== undefined) {
            type = "DOMMouseScroll";
        }
        el.addEventListener(type, function(event) {
            var type = event.type;
            if (type == "DOMMouseScroll" || type == "mousewheel") {
                event.delta = event.wheelDelta ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
            }
            fn.call(this, event);
        }, capture || false);
    };

    var FullPage = function(selector,option) {
        this.parent = typeof selector === "string" ? document.querySelector(selector) : selector;
        this.parent.style.visibility = "visible";
        Transform(this.parent, true);
        this.stepHeight = window.innerHeight;
        var children = this.parent.childNodes,
            len = children.length,
            i = 0;
        this.length = 0;
        for (; i < len; i++) {
            var child = children[i];
            if (child.nodeType !== 3) {
                child.style.height = this.stepHeight + "px";
                this.length++;
            }
        }

        var self = this;

        this.alloyTouch = new AlloyTouch({
            touch: this.parent,
            target: this.parent,
            property: "translateY",
            min: (1 - this.length) * this.stepHeight,
            max: 0,
            step: this.stepHeight,
            inertia: false,
            touchEnd: function (evt, v, index) {

                var step_v = index * this.step * -1;
                var dx = v - step_v;

                if (v < this.min) {
                    this.to(this.min);
                } else if (v > this.max) {
                    this.to(this.max);
                } else if (Math.abs(dx) < 30) {
                    this.to(step_v);

                }
                else if (dx > 0) {
                    this.to(step_v + this.step);

                } else {

                    this.to(step_v - this.step);
                }
                return false;
            },
            animationEnd: function () {
                option.animationEnd.apply(this,arguments);
                self.moving = false;
            }
        });

        this.moving = false;

        addEvent(this.parent,"mousewheel" ,function (evt) {
            if(self.moving) return;
            self.moving = true;
            if(evt.delta>0 ){
                self.prev();
            }else {
                self.next();
            }
        });
    };

    FullPage.prototype = {
        next:function () {
            var index = this.alloyTouch.currentPage+1;
            if(index>this.length-1)index=this.length-1;
            this.to(index);
        },
        prev:function () {
            var index = this.alloyTouch.currentPage-1;
            if(index<0) index = 0;
            this.to(index);
        },
        to:function (index) {
            this.alloyTouch.to(-1*index*this.stepHeight);
        }
    };


    AlloyTouch.FullPage = FullPage;
})();