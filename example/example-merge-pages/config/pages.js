const PAGES = [
	// #ifdef APP-NVUE
		{
			"path": "index33/index333",
			name:'index33'
		},
	// #endif
	{
		"path": "index/index",
		"style": {
			"navigationBarTitleText": "uni-app",
			name: 'hhyang(dasdsadasd)',
			beforeEnter: function(to, from, next) {

			},
			array: [
				{
					beforeEnter: function(to, from, next) {
					
					},
					beforeEnter1() {
					
					},
					
					beforeEnter2: () => {
					
					},
				}
			],
			beforeEnter1() {

			},
			beforeEnter2: () => {

			},
			beforeEnter3: to => {

			},
		}
	},
	{
		beforeEnter: function(to, from, next) {

		},
		"path": "index2/index2",
		"style": {
			"navigationBarTitleText": "uni-app",
			beforeEnter: function(to, from, next) {

			}
		}
	},
];

export default PAGES;
