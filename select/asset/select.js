var ISelect = function (option) {
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
                                <div class="iselect-toolbar"><a class="iselect-toolbar-ok">完成</a></div>\
                                <div class="iselect-options">\
                                    <ul class="iselect-scroll">'+ lis + ' </ul>\
                                    <div class="iselect-mask1"></div>\
                                    <div class="iselect-mask2"></div>\
                                </div>\
                            </div></div>');

    var wraps = parent.querySelectorAll(".iselect-wrap"),
        wrap = wraps[wraps.length-1],
        container = wrap.querySelector(".iselect"),
        scroll = container.querySelector(".iselect-scroll"),
        warpper = container.querySelector(".iselect-options"),
        okBtn = container.querySelector(".iselect-toolbar-ok"),

        step = 30,

        minTop = step * 2;

    css(scroll, 'top',2 * step - option.selectedIndex * step);
//实用tap代替？
    okBtn.addEventListener("click", function () {
        this.hide();
        var index = getSelectedIndex();
        if (index !== preSelectedIndex) {
            option.change && option.change.call(this, option.options[index], index);
            preSelectedIndex = index;
        }
        option.complete&&option.complete.call(this, option.options[index], index);
    }.bind(this), false);




    function css(element,name,value) {
        element.style[name] = value + "px";
    }

    function getSelectedIndex() {
        //60  30  0   -30   -60...   -300
        var rpt= (step*2- parseInt(window.getComputedStyle(scroll).top))/step;
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


    }
}