## PhyTouch

丝般顺滑的触摸运动方案

Smooth scrolling, rotation, pull to refresh and any motion for the web.

## Install

```js
npm install phy-touch
```

* [https://unpkg.com/phy-touch@0.2.6/index.js](https://unpkg.com/phy-touch@0.2.6/index.js)

## Usage

```js
var phyTouch = new PhyTouch({
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
  value: 0,
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
phyTouch.to(value, time, ease)
```

* `value`是必填项
* `time`是非必填项，默认值是600
* `ease`是非必填项，默认值是先加速后减速的运动函数，CSS版本默认值是`cubic-bezier(0.1, 0.57, 0.1, 1)`


通过对象的实例可以自行停止DOM运动:

``` js
phyTouch.stop()
```

## Demo(Mobile)

- Pull To Refresh: [http://alloyteam.github.io/PhyTouch/refresh/pull_refresh/](http://alloyteam.github.io/PhyTouch/refresh/pull_refresh/)
- QQ KanDian: [http://alloyteam.github.io/PhyTouch//refresh/infinite/kandian.html](http://alloyteam.github.io/PhyTouch//refresh/infinite/kandian.html)
- Full Page Scroll : [http://alloyteam.github.io/PhyTouch/full_page/](http://alloyteam.github.io/PhyTouch/full_page/)
- Simple : [http://alloyteam.github.io/PhyTouch/example/simple.html](http://alloyteam.github.io/PhyTouch/example/simple.html)
- 3D : [http://alloyteam.github.io/PhyTouch/example/3d.html](http://alloyteam.github.io/PhyTouch/example/3d.html)
- Rotate : [http://alloyteam.github.io/PhyTouch/example/rotate.html](http://alloyteam.github.io/PhyTouch/example/rotate.html)
- Carousel : [http://alloyteam.github.io/PhyTouch/example/carousel.html](http://alloyteam.github.io/PhyTouch/example/carousel.html)
- Carousel2 : [http://alloyteam.github.io/PhyTouch/example/carousel2.html](http://alloyteam.github.io/PhyTouch/example/carousel2.html)
- Three.js : [http://alloyteam.github.io/PhyTouch/example/threejs/](http://alloyteam.github.io/PhyTouch/example/threejs/)

## Related links

* [omi-touch: Omi /PhyTouch integration](https://github.com/Tencent/omi/tree/master/packages/omi-touch)
* [PhyTouch Wiki](https://github.com/AlloyTeam/PhyTouch/wiki)
* [css3transform](https://github.com/Tencent/omi/tree/master/packages/omi-transform)

## License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
