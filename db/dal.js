module.exports = function(config) {
	var formDbObject = require('./scheme')(config);

	//methods

	var getList = function (onComplete) {
		formDbObject.find(function (err, forms) {
			onComplete(err, forms);
		});
	};

	var getForm = function (id, onComplete) {
		formDbObject.findById(id, function (err, form) {
			onComplete(err, form);
		});
	};

	var createForm = function (data, onComplete) {
		var item = new formDbObject({
			name: data.name,
			description: data.description,
			type: data.type,
			isActive: data.isActive,
			formOptions: data.formOptions
		});
		item.save(function (err, form) {
			onComplete(err, form);
		});
	};

	var updateForm = function (data, onComplete) {
		formDbObject.findById(data._id, function (err, form) {
			form.name = data.name;
			form.description = data.description;
			form.type = data.type;
			form.isActive = data.isActive;
			form.formOptions = data.formOptions;
			form.save(function (err, form) {
				onComplete(err, form);
			});
		});
	};

	var deleteForm = function (id, onComplete) {
		formDbObject.findById(id, function (err, form) {
			form.remove(function (removeErr) {
				onComplete(removeErr);
			});
		});
	};

	return {
		getList: getList,
		getForm: getForm,
		createForm: createForm,
		updateForm: updateForm,
		deleteForm: deleteForm
	}
};