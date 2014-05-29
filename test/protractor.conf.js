exports.config = {
	// Do not start a Selenium Standalone sever - only run this using chrome.
//	chromeOnly: true,
//	chromeDriver: '../node_modules/protractor/selenium/chromedriver',

	// Start a Selenium Standalone sever - only run this using chrome.
//	seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.41.0.jar',
//	seleniumPort: 4444,
//	seleniumArgs: ['-browserTimeout=60'],

	// Use already instantiated server via protractor tool "webdriver-manager update".
//	seleniumAddress: 'http://localhost:4444/wd/hub',

	// Use it with phantomjs via registering it with "./node_modules/phantomjs/bin/phantomjs --webdriver=9515"
	seleniumAddress: 'http://localhost:9515',

	// Capabilities to be passed to the webdriver instance.
//	capabilities: {
//		'browserName': 'chrome',
//		'chromeOptions': {
//			'args': ['test-type=true']
//		}
//	},
//
//	capabilities: {
//		'browserName': 'firefox'
//	},

	capabilities: {
		'browserName': 'phantomjs',
		'phantomjs.binary.path': './node_modules/phantomjs/bin/phantomjs'
	},

//	capabilities: {
//		'browserName': 'ie'
//	},

//	multiCapabilities: [
//		{
//			'browserName': 'firefox'
//		},
//		{
//			'browserName': 'chrome',
//			'chromeOptions': {
//				'args': ['test-type=true']
//			}
//		}
//	],

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