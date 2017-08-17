AlloyTouch.Select = function (option) {
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
        '<div class="iselect-wrap" style="height:'+window.innerHeight+'px"> <div class="iselect">\
                                 <div class="iselect-toolbar"><a class="iselect-toolbar-cancel">取消</a><a class="iselect-toolbar-ok">完成</a></div>\
                                <div class="iselect-options">\
                                    <ul class="iselect-scroll">'+ lis + ' </ul>\
                                    <div class="iselect-mask1 b1 bb bt"></div>\
                                    <div class="iselect-mask2 b1 bt"></div>\
                                </div>\
                            </div></div>');

    var wraps = parent.querySelectorAll(".iselect-wrap"),
        wrap = wraps[wraps.length-1],
        container = wrap.querySelector(".iselect"),
        scroll = container.querySelector(".iselect-scroll"),
        warpper = container.querySelector(".iselect-options"),
        okBtn = container.querySelector(".iselect-toolbar-ok"),
        cancelBtn = container.querySelector(".iselect-toolbar-cancel"),
        step = 30,
        minTop = step * 2;
  
    wrap.addEventListener("touchmove", function (evt) {
        evt.preventDefault();

    }, false);

    var self = this;
    new AlloyTouch({
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

    new AlloyTouch({
        touch: cancelBtn,
        tap: function () {
            self.hide();         
        }
    })
    
    Transform(scroll);
    var alloyTouch = new AlloyTouch({
        touch: container,
        vertical: true,
        target: scroll,
        initialValue: preSelectedIndex*-1*step,
        property: "translateY",
        min: (len-1)*-30,
        max: 0,     
        step: step,
        change: function (value) { },
        touchStart: function (evt, value) { },
        touchMove: function (evt, value) { },
        touchEnd: function (evt, value) { },
        tap: function (evt, value) { },
        pressMove: function (evt, value) { },
        animationEnd: function (value) { }
    })

    function getSelectedIndex() {
        var rpt = (scroll.translateY*-1) / step;
        if (rpt < 0) return 0;
        if (rpt > option.options.length) return option.options.length - 1;
        return Math.round(rpt);
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