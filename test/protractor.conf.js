exports.config = {
	//baseUrl: 'http://localhost:3000/',

	seleniumAddress: 'http://localhost:3000/',

	chromeOnly: true,

	capabilities: {
		'browserName': 'chrome'
	},

	specs: ['e2e/*.js'],

	framework: 'jasmine',

	jasmineNodeOpts: {
		showColors: true,
	}
};