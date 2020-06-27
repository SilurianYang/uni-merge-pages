const {resolve}=require('path');

module.exports = {
	publicPath:'pages/',
	includes: [],
	rule: {
	},
	transformHook:function(pagesStr,extractStr,next){
		next(extractStr);
	},
	nodemon:{
		watch:[
			resolve(__dirname, './config/*'),
		],
		verbose: true,
	}
}
