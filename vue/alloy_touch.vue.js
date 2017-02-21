;(function(){
var AlloyTouch = typeof require === 'function'
    ? require('../alloy_touch.js')
    : window.AlloyTouch
var Transform = typeof require === 'function'
    ? require('../transformjs/transform.js')
    : window.Transform

var vueAlloyTouch = {};

vueAlloyTouch.install = function(Vue){

    var isVue2 = !!(Vue.version.substr(0,1) == 2);
    
    

    if(!AlloyTouch){
        throw new Error('you need include alloy_touch.js')
    }
    if(!Transform){
        throw new Error('you need include transform.js')
    }

    var directiveBinding = null;

    if(isVue2){
        directiveBinding = {
            bind: function(el, binding){
                //注册时的赋值 value, el已经挂载
                var options = getAlloyTouchConfig(el, binding.value);
                Transform(options.target);
                el.__alloytouch__handle = new AlloyTouch(options);
            },
            update: function (el, binding) {
                var value = binding.value;
                if(!el.__alloytouch__handle) {
                    return;
                }
                if(value.min!=undefined){
                    el.__alloytouch__handle.min = value.min;
                }
                if(value.max!= undefined){
                    el.__alloytouch__handle.max = value.max;
                }
            },
            unbind: function(el){
                el.__alloytouch__handle = null;
            }
        };
    }else {
        directiveBinding = {
            bind: function(){
                this.el.__alloytouch__handle = null;
            
            } ,
            update: function(binding){
                if(!this.el.__alloytouch__handle){
                    var options = getAlloyTouchConfig(this.el, binding);
                    Transform(options.target);
                    this.el.__alloytouch__handle = new AlloyTouch(options);
                }else {
                    if(binding.min!=undefined){
                        this.el.__alloytouch__handle.min = binding.min;
                    }
                    if(binding.max!=undefined){
                        this.el.__alloytouch__handle.max = binding.max; 
                    }
                }
            },
           unbind: function(){
                this.el.__alloytouch__handle = null;
           }
        }
    }

    Vue.directive('alloytouch', directiveBinding)
    function noop(){

    }
    function _getOption(value, defaultValue){
        return value==undefined ?defaultValue: value
    }

    function getAlloyTouchConfig(el, value) {

        var options = value.options || {}
        var methods = value.methods || {};
        var result = {
            touch: el,//反馈触摸的dom
            target: el, //运动的对象
            bindSelf: _getOption(options.bindSelf, false),
            property: _getOption(options.property, 'translateY'),  //被运动的属性
            vertical: _getOption(options.vertical,1),//不必需，默认是true代表监听竖直方向touch
            min: _getOption(options.min, 0), //不必需,运动属性的最小值
            max: _getOption(options.max, 0), //不必需,滚动属性的最大值
            sensitivity: _getOption(options.sensitivity, 1),//不必需,触摸区域的灵敏度，默认值为1，可以为负数
            factor: _getOption(options.factor, 1),//不必需,表示触摸位移与被运动属性映射关系，默认值是1
            spring: _getOption(options.spring, 1), //不必需,是否有回弹效果。默认是true
            step: _getOption(options.step, 45),//用于校正到step的整数倍
            tap: methods.tap || noop,
            pressMove: methods.pressMove || noop,
            change : methods.change || noop,
            touchEnd : methods.touchEnd || noop,
            touchStart : methods.touchStart || noop,
            touchMove : methods.touchMove || noop,
            touchCancel : methods.touchCancel || noop,
            reboundEnd : methods.reboundEnd || noop,
            animationEnd : methods.animationEnd || noop,
            correctionEnd : methods.correctionEnd || noop
        }
        if(value.min !=undefined) {
            result.min = value.min;
        }
        if(value.max !=undefined) {
            result.max = value.max;
        }
        if(!!options.touch){
            var touchEl = el.querySelector(options.touch);
            result.touch = touchEl || el;
        } 

        if(!!options.target){
            var target = el.querySelector(options.target);
            result.target = target || el;
        }

        return result;
    }
}

if(typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = vueAlloyTouch;
} else {
    window.vueAlloyTouch = vueAlloyTouch;
}

})();