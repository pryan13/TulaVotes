module.exports.init = function(app){
	var config = require('../config/wrapper')();
	var api = require('./api');

	var auth = function(req, res, next) {
		if (!req.session.userEmail || config.allowedUsers.indexOf(req.session.userEmail) < 0) {
			res.redirect('/login');
			return;
		}
		next();
	};

	app.get('/', auth, function(req, res){
		res.render('index', {userEmail: req.session.userEmail});
	});
	app.get('/login', function(req, res){
		res.render('login');
	});
	app.post('/login', function(req, res) {
		var email = req.body.email;
		if(email && config.allowedUsers.indexOf(email) >= 0){
			req.session.userEmail = email;
		}
		res.redirect('/');
	});
	app.get('/logout', function(req, res){
		if(req.session.userEmail){
			req.session.destroy();
			res.redirect('/');
		}
	});
	app.get('/partials/:name', function(req, res){
		res.render('partials/' + req.params.name);
	});
	app.use('/api', api);
	//app.get('*', routes.index);
};