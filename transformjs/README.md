## transformjs 

made css3 transform super easy

## Home

[http://alloyteam.github.io/AlloyTouch/transformjs/](http://alloyteam.github.io/AlloyTouch/transformjs/)

## Install

You can install it via npm:

```html
npm install css3transform
```

## API

```js
Transform(domElement, [notPerspective]);
```

## Usage

```js
Transform(domElement);//or Transform(domElement, true);

//set "translateX", "translateY", "translateZ", "scaleX", "scaleY", "scaleZ", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "originX", "originY", "originZ"
domElement.translateX = 100;
domElement.scaleX = 0.5;
domElement.originX = 0.5;

//get "translateX", "translateY", "translateZ", "scaleX", "scaleY", "scaleZ", "rotateX", "rotateY", "rotateZ", "skewX", "skewY", "originX", "originY", "originZ"
//console.log(domElement.translateX )
```

### React Version:

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