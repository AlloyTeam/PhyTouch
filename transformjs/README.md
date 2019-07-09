## transformjs 

made css3 transform super easy

## Home

[http://alloyteam.github.io/PhyTouch/transformjs/](http://alloyteam.github.io/PhyTouch/transformjs/)

## Demo

- [http://alloyteam.github.io/PhyTouch/transformjs/example/all.html](http://alloyteam.github.io/PhyTouch/transformjs/example/all.html)
- [http://alloyteam.github.io/PhyTouch/transformjs/example/soft.html](http://alloyteam.github.io/PhyTouch/transformjs/example/soft.html)
- [http://alloyteam.github.io/PhyTouch/transformjs/example/stars.html](http://alloyteam.github.io/PhyTouch/transformjs/example/stars.html)

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

### Omi Version:

* [omi-transform](https://github.com/AlloyTeam/omi/tree/master/plugins/omi-transform)


```js
import Omi from 'omix'
import 'omi-transform'

class App extends Omi.Component {
    installed(){
        setInterval(()=>{
            this.refs.test.rotateY += 1
        })
    }

    render() {
        return  <div omi-transform class="test" ref="test" rotateZ="0" translateX="100" perspective="400" >
                    omi-transform
                </div>
    }

    style(){
        return  `
            .test{
                font-size: 20px;
                border: 1px solid red;
                width: 150px;
                font-size
                min-height: 150px;
                text-align: center;
                line-height:150px;
            }
         `
    }
}

Omi.render(new App(),"#container")
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
