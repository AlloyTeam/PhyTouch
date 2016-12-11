;(function () {
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

        new AlloyTouch({
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
            animationEnd: option.animationEnd
        })
    }


    AlloyTouch.FullPage = FullPage;
})();