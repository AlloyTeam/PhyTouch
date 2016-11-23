English | [简体中文](./README_CN.md)

# AlloyTouch
super tiny size touch and physical motion library

* super tiny size library
* highly abstract component
* real touch feedback
* independent of style layout
* simple API design
* high efficiency movement
* real physical movement trace

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
            sensitivity: 1,
            factor: 1,
            min: 100, 
            max: 2000, 
            spring: true,
            change:function(){  }, 
            touchStart:function(value){  },
            touchMove:function(value){  },
            touchEnd:function(value){  },
            animationEnd:function(value){  } 
 })
```
# Demo

Simple Demo: [http://alloyteam.github.io/AlloyTouch/](http://alloyteam.github.io/AlloyTouch/) 

![usage](http://alloyteam.github.io/AlloyTouch/demo2.png)

3D Demo: [http://alloyteam.github.io/AlloyTouch/3d.html](http://alloyteam.github.io/AlloyTouch/example/3d.html) 

Rotate Demo: [http://alloyteam.github.io/AlloyTouch/rotate.html](http://alloyteam.github.io/AlloyTouch/example/rotate.html) 

Carousel Demo: [http://alloyteam.github.io/AlloyTouch/carousel.html](http://alloyteam.github.io/AlloyTouch/example/carousel.html) 