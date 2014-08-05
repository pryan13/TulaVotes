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

	var getFormList = function (req, res, owner) {
		var isMine = owner === 'mine',
			reqData = {
				requestedBy: req.session.user.id,
				getActiveOnly: !isMine, //get only active forms if not mine and all forms otherwise
				formOwner: isMine ? req.session.user.id : owner
			};
		dal.getList(reqData, function (err, forms) {
			onRequestComplete(res, err, forms);
		});
	};

	var onRequestComplete = function (res, err, data) {
		if (!err) {
			var response = {success: true};
			if(data)
				response.data = data;
			res.json(response);
		}
		else {
			console.log(err);
			buildResponse(res, 500, err.toString());
		}
	};

//get list
	router.get('/forms', auth, function (req, res) {
		getFormList(req, res);
	});

//get list of mine forms
	router.get('/forms/mine', auth, function (req, res) {
		getFormList(req, res, 'mine');
	});

//get list of owner's forms
	router.get('/forms/:ownerId', auth, function (req, res) {
		getFormList(req, res, req.params.ownerId);
	});

//get details for edit
	router.get('/forms/edit/:formId', auth, function (req, res) {
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

	router.get('/forms/stat/:formId', auth, function (req, res) {
		dal.getFormStat({formId: req.params.formId, requestedBy: req.session.user.id}, function (err, form) {
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
			onRequestComplete(res, err, null);
		})
	});

	return router;
};