## 安装

```
npm install m-select 
```

## 使用

```js
import MSelect from 'm-select'

var ms = new MSelect({
	options: cityData,
	level: 2,   //只有一个层级的话不用设置level或者设置为1
	renderTo: "#selectCtn",
	selectedIndex: [1, 2],
	change: function (data) {
	
	},
	complete: function (data) {
	
	}
})

ms.show()
ms.hide()
ms.reset()
```
