var nconf = require('nconf');

nconf.argv();
var runtimeAppConfig = nconf.get('configuration');

module.exports = function(configuration){
	var settings = require('../config/settings'),
		appConfiguration = configuration || runtimeAppConfig;
	return settings[appConfiguration || 'development'] || settings['development'];
};