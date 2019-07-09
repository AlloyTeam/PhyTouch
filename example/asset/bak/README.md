English | [简体中文](./README_CN.md)

# PhyTouch Select

Smooth Select for the web.

# API
```js
new PhyTouch.Select({
	options: [
		{ value: "all", text: "累计" },
		{ value: "2015-9", text: "2015年9月" },
		{ value: "2015-8", text: "2015年8月" },
		{ value: "2015-7", text: "2015年7月" },
		{ value: "2015-6", text: "2015年6月" },
		{ value: "2015-5", text: "2015年5月" },
		{ value: "2015-4", text: "2015年4月" },
		{ value: "2015-3", text: "2015年3月" },
		{ value: "2015-2", text: "2015年2月" },
		{ value: "2015-1", text: "2015年1月" },
		{ value: "2014-12", text: "2014年12月" },
		{ value: "2014-11", text: "2014年11月" },
		{ value: "2014-10", text: "2014年10月" }
	],
	selectedIndex: 3,
	change: function (item, index) {
	   
	},
	complete: function (item, index) {
		document.body.insertAdjacentHTML("beforeEnd", "<br/>选了第" + index + "项<br/>value:" + item.value + "<br/>text:" + item.text);
	}
})
```

# Many thanks to 
- [transformjs](http://alloyteam.github.io/PhyTouch/transformjs/)

# Who is using PhyTouch?

![preview](http://sqimg.qq.com/qq_product_operations/im/qqlogo/imlogo.png)

# License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
