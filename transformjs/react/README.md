## transformjs 

made css3 transform super easy

## Home

[http://alloyteam.github.io/AlloyTouch/transformjs/](http://alloyteam.github.io/AlloyTouch/transformjs/)

## Install

You can install it via npm:

```html
npm install css3transform-react
```

## Demo

- [https://alloyteam.github.io/AlloyTouch/transformjs/react/example/](https://alloyteam.github.io/AlloyTouch/transformjs/react/example/)
- [http://alloyteam.github.io/AlloyTouch/transformjs/example/stars.html](http://alloyteam.github.io/AlloyTouch/transformjs/example/stars.html)

## Usage

```js
//set "translateX", "translateY", "translateZ", "scaleX", "scaleY", "scaleZ", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "originX", "originY", "originZ"
render() {
    return (
        <Transform
          translateX={100}
          scaleX={0.5}
          originX={0.5}>
          <div>sth</div>
        </Transform>
    );
}

// you can also use other porps, such as "className" or "style"
render() {
    return (
        <Transform
          translateX={100}
          className="ani"
          style={{width: '100px', background: 'red'}}
          <div>sth</div>
        </Transform>
    );
}
```

# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.