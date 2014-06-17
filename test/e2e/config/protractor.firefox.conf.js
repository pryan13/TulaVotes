exports.config = {
	// Start a Selenium Standalone sever - only run this using chrome.
	seleniumServerJar: '../../../node_modules/protractor/selenium/selenium-server-standalone-2.42.0.jar',
	seleniumPort: 4444,
	seleniumArgs: ['-browserTimeout=60'],

	// Capabilities to be passed to the webdriver instance.
	capabilities: {
		'browserName': 'firefox'
	},

	// Spec patterns are relative to the current working directly when
	// protractor is called.
	specs: ['../*.js'],

	// Options to be passed to Jasmine-node.
	jasmineNodeOpts: {
		showColors: true,
		isVerbose: true,
		defaultTimeoutInterval: 30000
	}
};