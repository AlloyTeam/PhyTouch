# AlloyTouch

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

# API
```js
new AlloyTouch({
            touch:"#wrapper",//反馈触摸的dom
            vertical: true,//不必需，默认是true代表监听竖直方向touch
            target: target, //运动的对象
            property: "translateY",  //被运动的属性
            min: 100, //不必需,运动属性的最小值
            max: 2000, //不必需,滚动属性的最大值
            sensitivity: 1,//不必需,触摸区域的灵敏度，默认值为1，可以为负数
            factor: 1,//不必需,表示触摸位移与被运动属性映射关系，默认值是1
            step: 45,//用于校正到step的整数倍
            bindSelf: false,
            initialValue: 0,
            change:function(value){  }, //不必需，属性改变的回调。alloytouch.css版本不支持该事件
            touchStart:function(evt, value){  },
            touchMove:function(evt, value){  },
            touchEnd:function(evt,value){  },
            tap:function(evt, value){  },
            pressMove:function(evt, value){  },
            animationEnd:function(value){  } //运动结束
 })
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
