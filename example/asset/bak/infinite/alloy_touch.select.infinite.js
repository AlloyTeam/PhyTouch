PhyTouch.Select = function (option) {
    var options = option.options,
        lis = "",
        parent = document.body,
        i = 0,
        len = options.length,
        preSelectedIndex = option.selectedIndex;
    for (; i < len; i++) {
        lis += '<li>' + options[i].text + '</li>'
    }
    parent.insertAdjacentHTML("beforeEnd",
        '<div class="iselect-wrap" style="height:' + window.innerHeight + 'px"> <div class="iselect">\
                                <div class="iselect-toolbar"><a class="iselect-toolbar-cancel">取消</a><a class="iselect-toolbar-ok">完成</a></div>\
                                <div class="iselect-options">\
                                    <ul class="iselect-scroll">' + lis + lis + ' </ul>\
                                    <div class="iselect-mask1 b1 bb bt"></div>\
                                    <div class="iselect-mask2 b1 bt"></div>\
                                </div>\
                            </div></div>');

    var wraps = parent.querySelectorAll(".iselect-wrap"),
        wrap = wraps[wraps.length - 1],
        container = wrap.querySelector(".iselect"),
        scroll = container.querySelector(".iselect-scroll"),
        warpper = container.querySelector(".iselect-options"),
        okBtn = container.querySelector(".iselect-toolbar-ok"),
        cancelBtn = container.querySelector(".iselect-toolbar-cancel"),
        step = 30,
        minTop = step * 2;

    new PhyTouch({
        touch: cancelBtn,
        tap: function () {
            self.hide();
        }
    })

    var self = this;
    new PhyTouch({
        touch: okBtn,
        tap: function () {
            self.hide();
            var index = getSelectedIndex();
            if (index !== preSelectedIndex) {
                option.change && option.change.call(self, option.options[index], index);
                preSelectedIndex = index;
            }
            option.complete && option.complete.call(self, option.options[index], index);
        }

    })

    var scrollerHeight = 30 * len;

    Transform(scroll, true);
   
    var initValue = -1 * preSelectedIndex * step;
    correction(initValue)

    var phyTouch = new PhyTouch({
        touch: container,
        target: { y: -1 * preSelectedIndex * step },
        property: "y",
        vertical: true,
        step: step,
        change: function (value) {
            correction(value);
        },
        touchStart: function (evt, value) { },
        touchMove: function (evt, value) { },
        touchEnd: function (evt, value) { },
        tap: function (evt, value) { },
        pressMove: function (evt, value) { },
        animationEnd: function (value) { }
    })

    wrap.addEventListener("touchmove", function (evt) {
        evt.preventDefault();
    }, false);

    function getSelectedIndex() {
        var rpt = Math.abs(scroll.translateY % scrollerHeight) / step;
        return Math.round(rpt);
    }

    function correction(value) {
        value %= scrollerHeight;
        if (Math.abs(value) > scrollerHeight-90) {
            if (value > 0) {
                value -= scrollerHeight;
            } else {
                value += scrollerHeight;
            }
        }
        scroll.translateY = value - scrollerHeight;
    }

    this.show = function () {
        wrap.style.display = "block";
        container.style.visibility = "visible";
        container.style.display = "block";
    }

    this.hide = function () {
        wrap.style.display = "none";
        container.style.visibility = "hidden";
        container.style.display = "none";
    }
}