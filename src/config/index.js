module.exports={
    publicPath:'',
    includes: [],
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