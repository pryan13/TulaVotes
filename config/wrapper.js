var nconf = require('nconf');

nconf.argv();
var appConfig = nconf.get('configuration');

module.exports = require('../config/' + appConfig + '.config.js');