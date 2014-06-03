//var npm = require("npm");
//npm.load(null, function (er) {
//	//if (er) return handlError(er);
//	npm.commands.run(["protractor.chrome"/*, "args"*/], function (er, data) {
//		//if (er) return commandFailed(er)
//		// command succeeded, and data might have some info
//	});
//	npm.on("log", function (message) {  })
//});

//var exec = require('child_process').exec;
//child = exec('npm run protractor.chrome').stderr.pipe(process.stderr);

var exec = require('child_process').exec,
	child;

child = exec('node node_modules/phantomjs/bin/phantomjs --webdriver=9515',
	function (error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});