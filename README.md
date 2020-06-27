# uni-merge-pages

![coverage](https://img.shields.io/badge/coverage%20-98%25-green) ![npm](https://img.shields.io/badge/npm%20-v2.6.11-blue) ![license](https://img.shields.io/badge/license-MIT-red) ![auto](https://img.shields.io/badge/auto-100%25-orange)

之前有写这样一个库，通过读取 `pages.json` 文件内容中的 `pages`、`subPackages` 选项作为 [uni-simple-router](https://github.com/SilurianYang/uni-simple-router) 的路由表，再借助 [webpack](https://github.com/webpack/webpack) 注入全局变量，完成一些列的操作。然而 **此库刚好相反**，它可以让你编写 `js` 模块文件 自动完成 `pages.json` 写入。妈妈再也不用担心配置混乱的问题啦。**上手难度一颗星** 阅读完安装后直接[跳入注意事项即可]()
## 安装

您可以使用 `Yarn` 或 `npm` 安装该软件包（选择一个）：

##### Yarn

```sh
yarn global add uni-merge-pages nodemon
```
##### npm

```sh
npm install uni-merge-pages nodemon -g
```

## 注意事项
* 使用之前请把 `pages.json` 中的所有内容备份到其他文件，避免覆盖文件。`HBuilder X` 创建页面时，即使勾选 `在 pages.json 中注册` 也同样无效。插件只认模块化输出的产物。
* 模块化js必须在结尾使用 **`;`** 这样才能通知到插件更准确的捕捉。
* 目标捕捉内容默认是 `const` 声明，大写变量 包括：`PAGES、GLOBALSTYLE、EASYCOM、TABBAR、CONDITION、SUBPACKAGES、PRELOADRULE、PAGESOTHER`
* 禁止在对象最后一对 `key/value` 后 使用注释，如果需要注释请移步到 `key/value` 头部上
* 插件默认包含提取内容仅有7个，`workers` 默认是没包含的，如果需要写入到 `pages.json` 请使用 `PAGESOTHER` 包含
* `pages.json` 禁止手动往里面添加内容，因为下次热更直接会覆盖。请在模块 `js` 下添加。

## 开始使用

### 第一步：配置 `uni.config.js` 文件

在项目根目录或者任何地方新建一个 `uni.config.js` 文件，简单的配置一下。提供一些必要的选项即可。

```js
// uni.config.js
const {resolve}=require('path');

module.exports = {
	publicPath:'',        //预设一个公共路径
	nodemon:{
		watch:[     //监听当前项目根目录下的config文件目录 包括所有文件 默认只提取js文件
			resolve(__dirname, './config/*'),
		],
	}
}
```
以上示例是在当前项目根目录下，如果你是新建在其他地方。那请修改 `watch` 路径，记住是 **绝对路径**。然后再通过 `cli` 传递 `--config xxx/xxx/uni-config.js` 路径即可。**默认读取项目根目录下的 `uni-config.js`**

#### 还想更细腻一点的配置？安排
```js
// uni.config.js
const {resolve}=require('path');

module.exports = {
    publicPath:'',
    //只提取 这三个文件中的内容作为 pages.json 中的写入物 记住绝对路径 像下面这样
	includes: [     
		resolve(__dirname,'./config/pages.js'),
		resolve(__dirname,'./config/tabbar.js'),
    ],
    //插件提取完成后 会通知你 你可以进一步修改内容 并返回给你 插件 记住一定要 next 
	transformHook:function(pagesStr,extractStr,next){   
		next(extractStr);
	},
	nodemon:{
		watch:[
			resolve(__dirname, './config/*'),
        ],
        //  显示更详细的日志
		verbose: true,
	}
}
```
### 第二步：预设执行脚本
#### 有两种方式实现：
第一种在当前项目根目录下执行 `npm init -y` 编写 `scripts` 脚本即可
```js
{
  "name": "xxxxxx",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "dependencies": {},
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build:pages": "uni-merge-cli"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
需要使用时执行 `npm run build:pages` 即可。
 
第二种直接打开 `dos` cd 到项目根路径下 执行 `uni-merge-cli` 即可。
 

### 第三步：编写默认提取物文件代码
```js 
//config/pages.js
const PAGES = [
	// #ifdef APP-NVUE
		{
			path: "pages/index33/index333",
			name:'index33'
		},
	// #endif
	{
		"path": "index2/index2",
		"style": {
			"navigationBarTitleText": "uni-app",
		}
	},
];
export default PAGES;

//config/tabbar.js
const TABBAR = {
	"color": "#7A7E83",
	"selectedColor": "#3cc51f",
	"borderStyle": "black",
	"backgroundColor": "#f00",
	"list": [{
		"pagePath": "pages/component/index",
		"iconPath": "static/image/icon_component.png",
		"selectedIconPath": "static/image/icon_component_HL.png",
		"text": "组件"
	}, {
		"pagePath": "pages/API/index",
		"iconPath": "static/image/icon_API.png",
		"selectedIconPath": "static/image/icon_API_HL.png",
		"text": "接口"
	}]
};
export default TABBAR;
``` 
如果你没有预设 `uni-config.js` 中的 `rule`。请按照上面的配置进行编写，`大写声明法` **记住在一个声明完成的对象后面加上 `;` 以便于插件精准提取**。 如果不习惯这样的写法 你可以自己编写 `rule` 正则来提取即可。 **在每个对象最后一个key/value后禁止使用注释，请移步到头部注释**  


### 额外参数写入到 pages.json
因为插件默认只有 `7` 个提取物。 包括：`globalStyle、pages、easycom、tabBar、condition、subPackages、preloadRule`。而 `workers` 是没有包含在内的。如果你想写入多个插件没包含的提取物进去，可以这样做。
```js
// xxxx/config/other.js
const PAGESOTHER= { 
    workers:'workers',
    otherConfig:{
        name:'hhyang'
    }
};
```
默认插件会把 `PAGESOTHER` 下声明的所有扁平成一个对象，平级的写入到`pages.json` 中

### 默认配置项

`uni-config.js` 中的配置最后会和默认配置进行合并，你可以在 `uni-config.js` 中编写任何你想要的代码

```js
module.exports={
    //预设在 pages 节点下 path 的公共路径
    publicPath:'',     
    // 需要监听的文件目录下所包含的js文件 必须绝对路径 空则读取监听目录下的所有文件
    includes: [],
    // 提取文件内容的正则规则
	rule: {
		globalStyle: /(?<=const\s+GLOBALSTYLE\s*=\s*)\{[\s\S]*?}(?=\s*;)/,
		pages: /(?<=const\s+PAGES\s*=\s*)\[[\s\S]*?](?=\s*;)/,
		easycom: /(?<=const\s+EASYCOM\s*=\s*)\{[\s\S]*?}(?=\s*;)/,
		tabBar: /(?<=const\s+TABBAR\s*=\s*)\{[\s\S]*?}(?=\s*;)/,
		condition: /(?<=const\s+CONDITION\s*=\s*)\{[\s\S]*?}(?=\s*;)/,
		subPackages: /(?<=const\s+SUBPACKAGES\s*=\s*)\[[\s\S]*?](?=\s*;)/,
        preloadRule: /(?<=const\s+PRELOADRULE\s*=\s*)\{[\s\S]*?}(?=\s*;)/,
        pagesother:/(?<=const\s+PAGESOTHER\s*=\s*)\{[\s\S]*?}(?=\s*;)/
    },
    // 这些是 nodemon 的所有配置
    nodemon:{
        "verbose": false,
        "execMap": {
            "js": "node --harmony"
        },
        "restartable": "rs",
        "ignore": [".git", "node_modules/*"],
        "env": {
            "NODE_ENV": "production"
        },
        "ext": "js"
    }
}
```