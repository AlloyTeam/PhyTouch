;(function(){
var Transform = typeof require === 'function'
    ? require('../transform.js')
    : window.Transform;

var vueTransform = {}
	
vueTransform.install = function(Vue){
	var isVue2 = !!(Vue.version.substr(0,1) == 2);

	var directiveBinding = {
		bind: function(el, binding){
			Transform(el);
			var value = binding.value;
			for(var key in value){
				el[key] = value[key];
			}
		},
		update: function(el, binding){
			for(var key in value){
				el[key] = value[key];
			}
		},
		unbind: function(){

		}
	}
}

})();