var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('secret'));
app.use(express.static(path.join(__dirname, 'public')));
var auth = function(req, res, next) {
	if (!req.cookies.userEmail) {
		res.redirect('/login');
	}
	next();
};
app.get('/', auth, routes.index)
app.get('/login', function(req, res){
	res.render('login');
});
app.post('/login', function(req, res) {
	if (req.cookies.userEmail) {
		res.redirect('/');
	}
	else {
		res.cookie('userEmail', req.body.email).redirect('/');
	}
});
app.get('/logout', function(req, res){
	if(req.cookies.userEmail){
		res.clearCookie('userEmail').redirect('/');
	}
});
app.get('/partials/:name', routes.partials);
app.use('/api', api);
//app.get('*', routes.index);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
