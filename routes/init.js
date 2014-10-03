module.exports.init = function(app){
	var config = require('../config/wrapper')();
	var dal = require('../db/dal')(config);
	var api = require('./api')(dal);

	var auth = function(req, res, next) {
		if(req.session.user){
			dal.findUserById(req.session.user.id, function(result){
				if(!result)
					res.redirect('/login');
				next();
			});
		}
		else{
			res.redirect('/login');
		}
	};

	app.get('/', auth, function(req, res){
		res.render('index', {userName: req.session.user.name});
	});
	app.get('/login', function(req, res){
		res.render('login');
	});
	app.post('/login', function(req, res) {
		if(req.body.email){
			dal.getOrCreateUser({email: req.body.email.trim().toLowerCase()}, function(result){
				if(result) {
					req.session.user = {id: result._id, name: result.name};
					dal.trackActivity({requestedBy: result._id, activity: 'User logged in'});
				}
				res.redirect(req.body.url.replace("login",""));
			});
		}
		else {
			res.redirect('/');
		}
	});
	app.get('/logout', function(req, res){
		if(req.session.user){
			dal.trackActivity({requestedBy: req.session.user.id, activity: 'User logged out'});
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