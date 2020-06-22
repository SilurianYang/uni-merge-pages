const {resolve}=require('path');

module.exports = {
	includes: [
		resolve(__dirname, './config/pages.js'),
		resolve(__dirname, './config/tabbar.js')
	],
	rule: {
	},
	nodemon:{
		watch:[
			resolve(__dirname, './config/*'),
		],
		verbose: true,
	}
}
