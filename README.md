English | [简体中文](./README_CN.md)

# AlloyTouch

Smooth scrolling, rotation, pull to refresh and any motion for the web.

# Wiki

[https://github.com/AlloyTeam/AlloyTouch/wiki](https://github.com/AlloyTeam/AlloyTouch/wiki)

# Install
```js
npm install alloytouch
```

# API
```js
new AlloyTouch({
            touch:"#wrapper",
            vertical: true,
            target: target, 
            property: "translateY", 
            min: 100, 
            max: 2000, 
            sensitivity: 1,
            factor: 1,
            step: 45,
            bindSelf: false,
            initialValue: 0,
            change:function(value){  },
            touchStart:function(evt, value){  },
            touchMove:function(evt, value){  },
            touchEnd:function(evt, value){  },
            tap:function(evt, value){  },
			pressMove:function(evt, value){  },
            animationEnd:function(value){  } 
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

# Many thanks to 
- [transformjs](http://alloyteam.github.io/AlloyTouch/transformjs/)

# Who is using AlloyTouch?

![preview](http://sqimg.qq.com/qq_product_operations/im/qqlogo/imlogo.png)

# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
