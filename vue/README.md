English | [简体中文](./README_CN.md)

# AlloyTouch

Smooth scrolling, rotation, pull to refresh and any motion for the web.

### Demo(Mobile)

- ScrollList Vue1: [http://alloyteam.github.io/AlloyTouch/vue/example/](http://alloyteam.github.io/AlloyTouch/vue/example/vue1)
- ScrollList Vue2: [http://alloyteam.github.io/AlloyTouch/vue/example/](http://alloyteam.github.io/AlloyTouch/vue/example/vue2)

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
                  touch:"",//dom for touching
                  target: '#scroller', //dom for transform
                  vertical: true,
                  property: "translateY",  
                  sensitivity: 1,
                  factor: 1,
                  min: window.innerHeight - 45 - 48 - 2000, 
                  max: 0, 
                  step: 40
            }
      },
      methods: {
            onAnimationEnd(){
                  console.log('onAnimationEnd')
            }
      },
      //dynamic set property
      //min: xxx,
      //max: xxx
});
```

# Many thanks to 
- [transformjs](http://alloyteam.github.io/AlloyTouch/transformjs/)
