module.exports = function(dal) {
	var router = require('express').Router();

	var buildResponse = function(res, status, error){
		res.statusCode = status;
		res.send({error: error});
	};

	var auth = function(req, res, next) {
		if(req.session.user){
			dal.findUserById(req.session.user.id, function(result){
				if(!result) {
					buildResponse(res, 401, "Unauthorized request");
				}
				next();
			});
		}
		else{
			buildResponse(res, 401, "Unauthorized request");
		}
	};

	var getFormList = function (res) {
		dal.getList(function (err, forms) {
			onRequestComplete(res, err, forms);
		});
	};

	var onRequestComplete = function (res, err, data, onSuccessCallback) {
		if (!err) {
			if (onSuccessCallback) {
				onSuccessCallback();
				return;
			}
			res.json({success: true, data: data});
		}
		else {
			console.log(err);
			buildResponse(res, 500, err.toString());
		}
	};

//get list
	router.get('/forms', auth, function (req, res) {
		getFormList(res);
	});

//get details for edit
	router.get('/forms/:formId', auth, function (req, res) {
		dal.getForm(req.params.formId, function (err, form) {
			onRequestComplete(res, err, form);
		});
	});

//get details for view
	router.get('/forms/view/:formId', auth, function (req, res) {
		dal.getFormView({formId: req.params.formId, requestedBy: req.session.user.id}, function (err, form) {
			onRequestComplete(res, err, form);
		});
	});

//save vote
	router.post('/forms/vote', auth, function (req, res) {
		dal.voteOnForm({voteData: req.body, requestedBy: req.session.user.id}, function (err, form) {
			onRequestComplete(res, err, form);
		})
	});

//create form
	router.post('/forms', auth, function (req, res) {
		dal.createForm({formData: req.body, requestedBy: req.session.user.id}, function (err, form) {
			onRequestComplete(res, err, form);
		})
	});

//update form
	router.put('/forms', auth, function (req, res) {
		dal.updateForm(req.body, function (err, form) {
			onRequestComplete(res, err, form);
		});
	});

//delete form
	router.delete('/forms/:formId', auth, function (req, res) {
		dal.deleteForm(req.params.formId, function (err) {
			onRequestComplete(res, err, null, function () {
				getFormList(res);
			});
		})
	});

	return router;
};