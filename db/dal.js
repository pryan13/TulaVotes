var formDbObject = require('./scheme');

//methods

var getList = function(onComplete){
	formDbObject.find(function(err, forms){
		onComplete(err, forms);
	});
};

var getForm = function(id, onComplete){
	formDbObject.findById(req.params.formId, function (err, form) {
		onComplete(err, form);
	});
};

var createForm = function(data, onComplete){
	var item = new formDbObject({
		name: data.name,
		description: data.description,
		type: data.type,
		isActive: data.isActive
	});
	item.save(function (err, form) {
		onComplete(err, form);
	});
};

var updateForm = function(data, onComplete){
	formDbObject.findById(data.formId, function (err, form) {
		form.name = data.name;
		form.description = data.description;
		form.type = data.type;
		form.isActive = data.isActive;
		form.save(function (err, form) {
			onComplete(err, form);
		});
	});
};

var deleteForm = function(id, onComplete){
	formDbObject.findById(id, function (err, form) {
		form.remove(function (removeErr) {
			onComplete(removeErr);
		});
	});
};

module.exports.getList = getList;
module.exports.getForm = getForm;
module.exports.createForm = createForm;
module.exports.updateForm = updateForm;
module.exports.deleteForm = deleteForm;