(function () {
    if(!AlloyTouch) throw new Error('you need to include AlloyTouch!');

    if(!Transform) throw new Error('you need to include Transform!');

    // create list
    function createList(parent, num) {
        var list = [];
        for(var i=0; i<num; i++) {
            var div = document.createElement('div');
            div.id = 'alloy-selector-line-1-' + i;
            div.className = 'alloy-selector-line';

            var ul = document.createElement('ul');
            div.appendChild(ul);

            Transform(div);
            list.push(div);
            parent.appendChild(div);
        }

        return list;
    }

    // create touch area
    function createTouch(parent, num) {
        var touches = [];
        for(var i=0; i<num; i++) {
            var div = document.createElement('div');
            div.className = 'alloy-selector-touch' + i;

            touches.push(div);
            parent.appendChild(div);
        }

        return touches;
    }

    function _noop() {}

    AlloyTouch.MultipleSelect = function (option) {
        this.renderTo = typeof option.renderTo === 'string' ? document.querySelector(option.renderTo) : option.renderTo;
        this.options = option.options;
        this.level = option.level;
        this.complete = option.complete || _noop;
        this.change = option.change || _noop;

        var that = this;
        var _nowSelected = option.selectedIndex || [];

        // merge options list
        function _mergeListInfo(list) {
            var arr = [];
            var info = {};
            for(var i=0,len=list.length; i<len; i++) {
                arr.push('<li>' + list[i].name + '</li>');

                info[i] = list[i].list ? _mergeListInfo(list[i].list) : {length: 0};
            }
            info.length = i;
            info.content = arr.join('');

            return info;
        }

        // init options
        var _cache = _mergeListInfo(this.options);
        // init selected
        for(var i=0; i<this.level; i++) {
            if(!_nowSelected[i]) _nowSelected[i] = 0;
        }

        var tpl = '<div class="alloy-selector">\
                    <div class="alloy-selector-mask"></div>\
                    <div class="alloy-selector-wrap">\
                        <div class="alloy-selector-head jmu-border-1px border-bottom">\
                            <div id="alloy-selector-complete-button-1" class="alloy-selector-button">完成</div>\
                        </div>\
                        <div id="alloy-selector-body" class="alloy-selector-body">\
                            <div class="alloy-selector-submask1 jmu-border-1px border-bottom"></div>\
                            <div class="alloy-selector-submask2 jmu-border-1px border-top"></div>\
                        </div>\
                    </div>\
                </div>';

        this.renderTo.insertAdjacentHTML('beforeEnd', tpl);

        
        // mask.style.height = window.innerHeight + "px";
        
        // get selected arr
        function getSelectedArr() {
            var arr = [_nowSelected];
            var options = that.options || [];
            _nowSelected.forEach(function(sel) {
                options = options[sel] || {};
                arr.push(options && options.name);
                options = options.list || [];
            });

            return arr;
        }
        
        // enter btn
        var completeBtn = document.getElementById('alloy-selector-complete-button-1');
        completeBtn.addEventListener('touchend', function (e) {
            that.complete.apply(that, getSelectedArr());
            e.stopPropagation();
            e.preventDefault();
        }, false);

        var parent = document.getElementById('alloy-selector-body');
        var list = createList(parent, this.level);
        var touches = createTouch(parent, this.level);
        var atList = {};

        // init list
        for(var l=0; l<this.level; l++) {
            var info = _getList.call(this, l);
            list[l].querySelector('ul').innerHTML = info.content;

            var listInit = info[_nowSelected[l]] ? _nowSelected[l] : 0;
            _nowSelected[l] = listInit;
            var at = new AlloyTouch({
                touch: touches[l], // 反馈触摸的dom
                target: list[l], // 运动的对象
                initialVaule: listInit * -33,
                property: 'translateY',  // 被滚动的属性
                min: -33 * (info.length - 1), // 不必需,滚动属性的最小值
                max: 0,
                animationEnd: (function(l) {
                    return function(value) {
                        _nowSelected[l] = Math.round(Math.abs(value / 33));

                        if(l === that.level-1) return; // the last list has not children

                        for(var j=l+1; j < that.level; j++) {
                            var childrenInfo = _getList.call(that, j);
                            _nowSelected[j] = 0;
                            list[j].querySelector('ul').innerHTML = childrenInfo.content || '';
                            atList[j].min = -33 * (childrenInfo.length - 1);
                            list[j].translateY = 0;
                        }

                        that.change.apply(that, getSelectedArr());
                    }
                })(l),
                step: 33
            });

            atList[l] = at;
        }

        // get options list
        function _getList(levelIndex) {
            levelIndex = levelIndex || 0;
            var parentSelected = _nowSelected[0] || 0;
            var cache = _cache;

            for(var i=0; i<levelIndex; i++) {
                parentSelected = _nowSelected[i];
                cache = cache[parentSelected];

                if(!cache) return {length: 0};
            }

            return cache;
        }
    }
    
})()