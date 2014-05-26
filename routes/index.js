exports.index = function(req, res){
	res.render('index', {userEmail: req.session.userEmail});
};

exports.partials = function(req, res){
	res.render('partials/' + req.params.name);
}