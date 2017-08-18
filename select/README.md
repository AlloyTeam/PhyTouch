## 安装

```
npm install m-select 
```

## 使用

```js
import MSelect from 'm-select'

let cityData = [
    {
        name: 'a',
        value: 1,
        list: [
            {
                name: 'a-1',
                value: 3
            }
        ]
    },
    {
        name: 'b',
        value: 2,
        list: [
            {
                name: 'b-1',
                value: 4
            }
        ]
    }
]

let ms = new MSelect({
	options: cityData,
	level: 2,   //只有一个层级的话不用设置level或者设置为1
	renderTo: "#selectCtn",
	selectedIndex: [1, 2],
	change: function (data, selectedIndex) {
	
	},
	complete: function (data, selectedIndex) {
	
	}
})

//methods
ms.show()
ms.hide()
ms.reset()
```
