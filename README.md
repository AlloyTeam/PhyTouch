﻿# AlloyTouch

丝般顺滑的触摸运动方案

Smooth scrolling, rotation, pull to refresh and any motion for the web.

# Related links

* [AlloyTouch Wiki](https://github.com/AlloyTeam/AlloyTouch/wiki)
* [transformjs](http://alloyteam.github.io/AlloyTouch/transformjs/)
* [omi-touch: Omi /AlloyTouch integration](https://github.com/AlloyTeam/omi/tree/master/plugins/omi-touch)
* [Donate to AlloyTouch](http://alloyteam.github.io/donate.html)

# Install
```js
npm install alloytouch
```

# CDN

* [https://unpkg.com/alloytouch@0.2.5/alloy_touch.js](https://unpkg.com/alloytouch@0.2.5/alloy_touch.js)
* [https://unpkg.com/alloytouch@0.2.5/alloy_touch.css.js](https://unpkg.com/alloytouch@0.2.5/alloy_touch.css.js)

# API
```js
var alloyTouch = new AlloyTouch({
            touch:"#wrapper",//反馈触摸的dom
            vertical: true,//不必需，默认是true代表监听竖直方向touch
            target: target, //运动的对象
            property: "translateY",  //被运动的属性
            min: 100, //不必需,运动属性的最小值
            max: 2000, //不必需,滚动属性的最大值
            sensitivity: 1,//不必需,触摸区域的灵敏度，默认值为1，可以为负数
            factor: 1,//不必需,表示触摸位移运动位移与被运动属性映射关系，默认值是1
            moveFactor: 1,//不必需,表示touchmove位移与被运动属性映射关系，默认值是1
            step: 45,//用于校正到step的整数倍
            bindSelf: false,
            maxSpeed: 2, //不必需，触摸反馈的最大速度限制 
            initialValue: 0,
            change:function(value){  }, 
            touchStart:function(evt, value){  },
            touchMove:function(evt, value){  },
            touchEnd:function(evt,value){  },
            tap:function(evt, value){  },
            pressMove:function(evt, value){  },
            animationEnd:function(value){  } //运动结束
 })
```

通过对象的实例可以自行运动DOM:

``` js
alloyTouch.to(value, time, ease)
```

* `value`是必填项
* `time`是非必填项，默认值是600
* `ease`是非必填项，默认值是先加速后减速的运动函数，CSS版本默认值是`cubic-bezier(0.1, 0.57, 0.1, 1)`


通过对象的实例可以自行停止DOM运动:

``` js
alloyTouch.stop()
```

# Demo(Mobile)

- Pull To Refresh: [http://alloyteam.github.io/AlloyTouch/refresh/pull_refresh/](http://alloyteam.github.io/AlloyTouch/refresh/pull_refresh/)
- QQ KanDian: [http://alloyteam.github.io/AlloyTouch//refresh/infinite/kandian.html](http://alloyteam.github.io/AlloyTouch//refresh/infinite/kandian.html)
- Full Page Scroll : [http://alloyteam.github.io/AlloyTouch/full_page/](http://alloyteam.github.io/AlloyTouch/full_page/)
- Simple : [http://alloyteam.github.io/AlloyTouch/example/simple.html](http://alloyteam.github.io/AlloyTouch/example/simple.html)
- 3D : [http://alloyteam.github.io/AlloyTouch/example/3d.html](http://alloyteam.github.io/AlloyTouch/example/3d.html)
- Rotate : [http://alloyteam.github.io/AlloyTouch/example/rotate.html](http://alloyteam.github.io/AlloyTouch/example/rotate.html)
- Carousel : [http://alloyteam.github.io/AlloyTouch/example/carousel.html](http://alloyteam.github.io/AlloyTouch/example/carousel.html)
- Carousel2 : [http://alloyteam.github.io/AlloyTouch/example/carousel2.html](http://alloyteam.github.io/AlloyTouch/example/carousel2.html)
- Three.js : [http://alloyteam.github.io/AlloyTouch/example/threejs/](http://alloyteam.github.io/AlloyTouch/example/threejs/)

# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
