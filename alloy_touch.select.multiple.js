(function () {
    if(!AlloyTouch) throw new Error('you need to include AlloyTouch!');

    AlloyTouch.MultipleSelect = function (option) {
        this.renderTo = typeof option.renderTo === 'string' ? document.querySelector(option.renderTo) : option.renderTo;
        this.length = option.options.length;
        this.options = option.options;

        var that = this;
        
        var i = 0;
        var arrProv = [],arrCity=[];
        for (; i < this.length; i++) {
            var item =this.options[i];
            if (option.selectedIndex[0] === i) {
                arrCity = item.list;
            }
        }

        var tpl = '<div class="alloy-selector">\
                    <div class="alloy-selector-mask"></div>\
                    <div class="alloy-selector-wrap">\
                        <div class="alloy-selector-head jmu-border-1px border-bottom">\
                            <div id="alloy-selector-complete-button-1" class="alloy-selector-button">完成</div>\
                        </div>\
                        <div class="alloy-selector-body">\
                            <div class="alloy-selector-submask1 jmu-border-1px border-bottom"></div>\
                            <div class="alloy-selector-submask2 jmu-border-1px border-top"></div>\
                            <div id="alloy-selector-line-1-0" class="alloy-selector-line">\
                                <ul></ul>\
                            </div>\
                            <div id="alloy-selector-line-1-1" class="alloy-selector-line">\
                                <ul></ul>\
                            </div>\
                            <div class="alloy-selector-left"></div>\
                            <div class="alloy-selector-right"></div>\
                        </div>\
                    </div>\
                </div>';

        this.renderTo.insertAdjacentHTML('beforeEnd', tpl);

       
        for (var p in this.options) {
            arrProv.push(p);
         
        }

        var _selectedP = '';
        var _selectedC = '';
        var _p2cCache = {};
        // mask.style.height = window.innerHeight + "px";
        
        // enter btn
        var completeBtn = document.getElementById('alloy-selector-complete-button-1');
        completeBtn.addEventListener('touchend', function (e) {
            alert(_selectedP + '-' + _selectedC);
            e.stopPropagation();
            e.preventDefault();
        }, false);

        var list = document.querySelectorAll('.alloy-selector-line');
        var list1 = list[0];
        var arr1 = [];
        var arrProv = [];
        for (var p in this.options) {
            if (!_selectedP) {
                _selectedP = p;
            }
            arrProv.push(p);
            arr1.push('<li>' + p + '</li>');
        }
        list1.querySelector('ul').innerHTML = arr1.join('');
        var list2 = list[1];
        var cityInfo = _getCityList.call(that);
        _selectedC = cityInfo[0];
        list2.querySelector('ul').innerHTML = cityInfo.content;
        var leftDiv = document.querySelector('.alloy-selector-left');
        var rightDiv = document.querySelector('.alloy-selector-right');

        Transform(list1);
        Transform(list2);
        var at1 = new AlloyTouch({
            touch: leftDiv, // 反馈触摸的dom
            target: list1, // 运动的对象
            property: "translateY",  // 被滚动的属性
            min: -33 * (arrProv.length - 1), // 不必需,滚动属性的最小值
            max: 0,
            animationEnd: function (value) {
                console.log(value)
                _selectedP = arrProv[Math.round(Math.abs(value / 33))];
                console.log(Math.abs(value / 33))
                var cityInfo = _getCityList.call(that);

                _selectedC = cityInfo[0];
                list2.querySelector("ul").innerHTML = cityInfo.content;
                at2.min = -33 * (cityInfo.length - 1);
                list2.translateY = 0;
            },
            step: 33
        });
        var at2 = new AlloyTouch({
            touch: rightDiv, // 反馈触摸的dom
            target: list2, // 运动的对象
            property: "translateY",  // 被滚动的属性
            min: -33 * (cityInfo.length - 1), // 不必需,滚动属性的最小值
            max: 0,
            animationEnd: function (value) {
                _selectedC = _getCityList.call(that)[Math.round(Math.abs(value / 33))];
                //console.log(_selectedC);
            },
            step: 33
        });


        function _getCityList() {
            if (!_p2cCache[_selectedP]) {
                var arr = [];
                var info = {};
                for (var i = 0; i < this.options[_selectedP].length; ++i) {
                    info[i] = this.options[_selectedP][i];
                    arr.push('<li>' + info[i] + '</li>');
                }
                info.length = i;
                info.content = arr.join('')
                _p2cCache[_selectedP] = info;
            }
            return _p2cCache[_selectedP];
        }
    }
    
})()