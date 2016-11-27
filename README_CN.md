[English](https://github.com/AlloyTeam/AlloyTouch) | 简体中文

# AlloyTouch
60FPS的触摸运动

* 超小的文件大小
* 高度抽象的组件
* 真实的触摸反馈
* 与样式布局无关的设计
* 简洁的API设计
* 高效率的运动方式
* 真实的物理运动轨迹

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
            spring: true, //不必需,是否有回弹效果。默认是true
            step: 45,//用于校正到step的整数倍
            change:function(){  }, //不必需，属性改变的回调。alloytouch.css版本不支持该事件
            touchStart:function(value){  },
            touchMove:function(value){  },
            touchEnd:function(value){  },
            animationEnd:function(value){  } //运动结束
 })
```
# 演示(Mobile)

Simple Demo: [http://alloyteam.github.io/AlloyTouch/](http://alloyteam.github.io/AlloyTouch/) 

3D Demo: [http://alloyteam.github.io/AlloyTouch/3d.html](http://alloyteam.github.io/AlloyTouch/example/3d.html) 

Rotate Demo: [http://alloyteam.github.io/AlloyTouch/rotate.html](http://alloyteam.github.io/AlloyTouch/example/rotate.html) 

Carousel Demo: [http://alloyteam.github.io/AlloyTouch/carousel.html](http://alloyteam.github.io/AlloyTouch/example/carousel.html) 


# 感谢
[transformjs](http://alloyteam.github.io/AlloyTouch/transformjs/)

# 谁用AlloyTouch?

![preview](http://sqimg.qq.com/qq_product_operations/im/qqlogo/imlogo.png)

# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.