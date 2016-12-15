[English](https://github.com/AlloyTeam/AlloyTouch) | 简体中文

# AlloyTouch

腾讯AlloyTeam移动Web触摸解决方案


### Demo(Mobile)

- 滚动列表Vue1: [http://alloyteam.github.io/AlloyTouch/vue/example/](http://alloyteam.github.io/AlloyTouch/vue/example/vue1)
- 滚动列表Vue2: [http://alloyteam.github.io/AlloyTouch/vue/example/](http://alloyteam.github.io/AlloyTouch/vue/example/vue2)


```html
<div id="wrapper" v-alloytouch="{options: options, methods:{animationEnd: onAnimationEnd}}">
      <div id="scroller" class="alloytouch-target">
            <ul>
            ...  
            </ul>
      </div>
</div>
```
```js
new Vue({
      el: '#page',
      data: {
            options: {
                  touch:"",//反馈触摸的dom, 默认 directive所在dom
                  vertical: true,//不必需，默认是true代表监听竖直方向touch
                  target: '#scroller', //运动的对象
                  property: "translateY",  //被滚动的属性
                  sensitivity: 1,//不必需,触摸区域的灵敏度，默认值为1，可以为负数
                  factor: 1,//不必需,默认值是1代表touch区域的1px的对应target.y的1
                  min: window.innerHeight - 45 - 48 - 2000, //不必需,滚动属性的最小值
                  max: 0, //不必需,滚动属性的最大值
                  step: 40
            }
      },
      methods: {
            onAnimationEnd(){
                  console.log('onAnimationEnd')
            }
      }
      //动态设置属性
      //min: xxx,
      //max: xxx
});
```
# 感谢
- [transformjs](http://alloyteam.github.io/AlloyTouch/transformjs/)

