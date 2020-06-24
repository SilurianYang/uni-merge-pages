const GLOBALSTYLE = {
	navigationBarTextStyle: 'black',
	"navigationBarTitleText": "演示",
	"navigationBarBackgroundColor": "#F8F8F8",
	"backgroundColor": "#F8F8F8",
	"renderingMode": "seperated", // 仅微信小程序，webrtc 无法正常时尝试强制关闭同层渲染
	"pageOrientation": "portrait" //横屏配置，全局屏幕旋转设置(仅 APP/微信/QQ小程序)，支持 auto / portrait / landscape
};

const CONDITION = { //模式配置，仅开发期间生效
	"current": 0, //当前激活的模式（list 的索引项）
	"list": [{
		"name": "test", //模式名称
		"path": "pages/component/view/index" //启动页面，必选
	}]
};

const  PAGESOTHER= {
	"workers": "workers",
	"aaaaaa":{
		name:'asdsdsdsdsd',
		ages:21,
		lll:887878787
	}
};
