var nconf = require('nconf');

nconf.argv();
var appConfig = nconf.get('configuration');
nconf.file({file: './config/' + appConfig + '.config.json'});

module.exports = nconf;