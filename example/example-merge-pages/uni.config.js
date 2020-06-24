const {resolve}=require('path');

module.exports = {
	includes:[
		resolve(__dirname, './config/pages.js'),
	],
	rule: {},
	nodemon:{
		watch:[
			resolve(__dirname, './config/*'),
		],
	}
}
