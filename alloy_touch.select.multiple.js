(function () {
    if(!AlloyTouch) throw new Error('you need to include AlloyTouch!');

    if(!Transform) throw new Error('you need to include Transform!');

    function getCss(level) {
        var t = '';
        var w = 100/level;
        for(var i=0; i<level; i++) {
            t += '.alloy-selector-touch' + i + ' {\
                  position: absolute;\
                  left: ' + i*w + '%;\
                  top: 0px;\
                  width: ' + w + '%;\
                  height: 500px;\
                  z-index: 1002;\
                }';
        }

        return '* {\
                  -webkit-tap-highlight-color: transparent;\
                  box-sizing: border-box;\
                }\
                .jmu-border-1px {\
                  position: relative;\
                }\
                .jmu-border-1px:after {\
                  display: block;\
                  position: absolute;\
                  top: 0;\
                  right: 0;\
                  bottom: 0;\
                  left: 0;\
                  -webkit-transform: scale(1);\
                  transform: scale(1);\
                  -webkit-transform-origin: 0 0;\
                  transform-origin: 0 0;\
                  content: "";\
                  pointer-events: none;\
                }\
                @media only screen and (-webkit-min-device-pixel-ratio: 2) {\
                  .jmu-border-1px:after {\
                    right: -100%;\
                    bottom: -100%;\
                    -webkit-transform: scale(0.5);\
                    transform: scale(0.5);\
                  }\
                }\
                .jmu-border-1px.border-bottom:after {\
                  border-bottom: 1px solid #cdcdcd;\
                }\
                .jmu-border-1px.border-top:after {\
                  border-top: 1px solid #cdcdcd;\
                }\
                .alloy-selector {\
                  overflow: hidden;\
                  position: fixed;\
                  top: 0;\
                  left: 0;\
                  bottom: 0;\
                  right: 0;\
                  z-index: 10000;\
                  padding: 0;\
                }\
                .alloy-selector-wrap {\
                  position: absolute;\
                  bottom: 0;\
                  left: 0;\
                  z-index: 1000;\
                  width: 100%;\
                  height: 256px;\
                  background-color: #fff;\
                  -webkit-transition: .3s ease-out all;\
                  transition: .3s ease-out all;\
                }\
                .alloy-selector-head {\
                  overflow: hidden;\
                  border-color: #bbb;\
                  padding: 9px;\
                  height: 44px;\
                }\
                .alloy-selector-button {\
                  display: block;\
                  float: right;\
                  width: 50px;\
                  font-size: 17px;\
                  line-height: 26px;\
                  text-align: right;\
                  color: #1d79eb;\
                  outline: 0;\
                }\
                .alloy-selector-button:focus,\
                .alloy-selector-button:hover {\
                  border: 0;\
                }\
                .alloy-selector-body {\
                  overflow: hidden;\
                  position: relative;\
                  padding: 0;\
                  text-align: center;\
                }\
                .alloy-selector-line {\
                  display: inline-block;\
                  position: relative;\
                  text-align: center;\
                  vertical-align: top;\
                  width: ' + w + '%;\
                }\
                .alloy-selector-line ul {\
                  list-style: none;\
                  margin: 91px 0 0 0;\
                  padding: 0;\
                  width: 100%;\
                  min-height: 256px;\
                }\
                .alloy-selector-line ul li {\
                  height: 33px;\
                  font-size: 23px;\
                  white-space: nowrap;\
                }\
                .alloy-selector-mask {\
                  background-color: rgba(0, 0, 0, 0.4);\
                  position: absolute;\
                  z-index: 999;\
                  width: 100%;\
                  left: 0;\
                  top: 0;\
                  bottom: 0;\
                }\
                .alloy-selector-submask1 {\
                  background-color: rgba(255, 255, 255, 0.7);\
                  position: absolute;\
                  z-index: 1001;\
                  width: 100%;\
                  height: 89px;\
                  top: 0px;\
                  left: 0px;\
                }\
                .alloy-selector-submask2 {\
                  background-color: rgba(255, 255, 255, 0.7);\
                  position: absolute;\
                  z-index: 1001;\
                  width: 100%;\
                  height: 90px;\
                  top: 122px;\
                  left: 0px;\
                }' + t;
    };

    // for widget's stylesheet
    function scoper(css) {
        var id = generateID();
        var prefix = "#" + id;
        css = css.replace(/\/\*[\s\S]*?\*\//g, '');
        var re = new RegExp("([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)", "g");
        css = css.replace(re, function(g0, g1, g2) {
            if (g1.match(/^\s*(@media|@keyframes|to|from|@font-face)/)) {
                return g1 + g2;
            }
            if (g1.match(/:scope/)) {
                g1 = g1.replace(/([^\s]*):scope/, function(h0, h1) {
                    if (h1 === "") {
                        return "> *";
                    } else {
                        return "> " + h1;
                    }
                });
            }
            g1 = g1.replace(/^(\s*)/, "$1" + prefix + " ");
            return g1 + g2;
        });
        addStyle(css,id+"-style");
        return id;
    }
    function generateID() {
        var id =  ("scoped"+ Math.random()).replace("0.","");
        if(document.getElementById(id)){
            return generateID();
        }else {
            return id;
        }
    }
    var isIE = (function () {
        var undef,
            v = 3,
            div = document.createElement('div'),
            all = div.getElementsByTagName('i');
        while (
            div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]
            );
        return v > 4 ? v : undef;
    }());
    function addStyle(cssText, id) {
        var d = document,
            someThingStyles = d.createElement('style');
        d.getElementsByTagName('head')[0].appendChild(someThingStyles);
        someThingStyles.setAttribute('type', 'text/css');
        someThingStyles.setAttribute('id', id);
        if (isIE) {
            someThingStyles.styleSheet.cssText = cssText;
        } else {
            someThingStyles.textContent = cssText;
        }
    }

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
        this.level = option.level || 1;
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

        var id = scoper(getCss(this.level));
        var tpl = '<div class="alloy-selector" id="' + id + '">\
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
        this.widget = document.getElementById(id);

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
    };

    AlloyTouch.MultipleSelect.prototype.show = function () {
      this.widget.style.visibility = "visible";
      this.widget.style.display = "block";
    };

    AlloyTouch.MultipleSelect.prototype.hide = function () {
      this.widget.style.visibility = "hidden";
      this.widget.style.display = "none";
    };
    
})();