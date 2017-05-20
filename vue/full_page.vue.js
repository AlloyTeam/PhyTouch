var FullPage = require('alloytouch/full_page/alloy_touch.full_page.js');
var Transform = require('alloytouch/transformjs/transform.js')

var directiveBinding = {
    bind: function (el, binding) {
        //注册transform为全局变量
        window.Transform = Transform
        new FullPage(el, {
            animationEnd: binding.value.methods.animationEnd,
            leavePage: binding.value.methods.leavePage,
            beginToPage: binding.value.methods.beginToPage
        })
    },
    update: function (value) {
    },
    unbind: function () {
    }
}
export default {
    install(Vue, options) {
        Vue.directive("fullpage", directiveBinding);
    }

}
