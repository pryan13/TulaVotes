var express = require('express');
var router = express.Router();
var config = require('../config/wrapper')();
var dal = require('../db/dal')(config);

var getFormList = function(res){
	dal.getList(function(err, forms){
		onRequestComplete(res, err, forms);
	});
};

var onRequestComplete = function(res, err, data, onSuccessCallback){
	if(!err){
		if(onSuccessCallback){
			onSuccessCallback();
			return;
		}
		res.json({success: true, data: data});
	}
	else{
		console.log(err);
		res.statusCode = 500;
		res.send({success: false, error: err.toString()});
	}
};

//get list
router.get('/forms', function (req, res) {
	getFormList(res);
});

//get details for edit
router.get('/forms/:formId', function (req, res) {
	dal.getForm(req.params.formId, function(err, form){
		onRequestComplete(res, err, form);
	});
});

//get details for view
router.get('/forms/view/:formId', function (req, res) {
	dal.getFormView({formId: req.params.formId, requestedBy: req.session.userEmail}, function(err, form){
		onRequestComplete(res, err, form);
	});
});

//save vote
router.post('/forms/vote', function (req, res) {
	dal.voteOnForm({voteData: req.body, requestedBy: req.session.userEmail}, function(err, form){
		onRequestComplete(res, err, form);
	})
});

//create form
router.post('/forms', function (req, res) {
	dal.createForm(req.body, function(err, form){
		onRequestComplete(res, err, form);
	})
});

//update form
router.put('/forms', function (req, res) {
	dal.updateForm(req.body, function (err, form) {
		onRequestComplete(res, err, form);
	});
});

//delete form
router.delete('/forms/:formId', function (req, res) {
	dal.deleteForm(req.params.formId, function (err) {
		onRequestComplete(res, err, null, function () {
			getFormList(res);
		});
	})
});

module.exports = router;
