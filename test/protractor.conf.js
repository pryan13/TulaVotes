exports.config = {
	// Do not start a Selenium Standalone sever - only run this using chrome.
	chromeOnly: true,
	chromeDriver: '../node_modules/protractor/selenium/chromedriver',

	// Capabilities to be passed to the webdriver instance.
	capabilities: {
		'browserName': 'chrome',
		'chromeOptions': {
			'args': ['test-type=true']
		}
	},

	// Spec patterns are relative to the current working directly when
	// protractor is called.
	specs: ['e2e/*.js'],

	// Options to be passed to Jasmine-node.
	jasmineNodeOpts: {
		showColors: true,
		isVerbose: true,
		defaultTimeoutInterval: 30000
	}
};