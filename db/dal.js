module.exports = function(config) {
	var dbObject = require('./scheme')(config),
		userDbObject = dbObject.userObject,
		formDbObject = dbObject.formObject;

	//methods

	var findUserById = function(userId, onComplete){
		userDbObject.findOne({_id: userId}, function(err, user){
			onComplete(user);
		});
	};

	var getOrCreateUser = function(data, onComplete){
		if(config.allowedUsers.indexOf(data.email) < 0)
			onComplete();
		else{
			userDbObject.findOne({email: data.email}, function(err, existingUser){
				if(existingUser){
					onComplete(existingUser);
				}
				else{
					var newUser = new userDbObject({
						email: data.email,
						name: data.name || data.email.split('@')[0]
					});
					newUser.save(function (err, savedUser) {
						onComplete(savedUser);
					});
				}
			});
		}
	};

	var getList = function (onComplete) {
		formDbObject.find().populate('createdBy', 'name').exec(function (err, forms) {
			onComplete(err, forms);
		});
	};

	var getForm = function (id, onComplete) {
		formDbObject.findOne({_id: id}).populate('createdBy').exec(function (err, form) {
			onComplete(err, form);
		});
	};

	var getFormView = function (data, onComplete) {
		formDbObject.findOne({_id: data.formId}).populate('createdBy', 'name').exec(function (err, form) {
			var result = {
				_id: form._id,
				name: form.name,
				description: form.description,
				createdBy: form.createdBy.name,
				createdAt: form.createdAt,
				type: form.type,
				formOptions: [],
				hasAlreadyVoted: false
			};
			for(var i = 0; i < form.formOptions.length; i++){
				var hasAlreadyVoted = false;
				for(var j = 0; j < form.formOptions[i].votes.length; j++){
					if(form.formOptions[i].votes[j].votedBy.toString() !== data.requestedBy)
						continue;
					hasAlreadyVoted = true;
					break;
				}
				result.formOptions.push({
					_id: form.formOptions[i]._id,
					text: form.formOptions[i].text,
					checked: hasAlreadyVoted
				});
			}
			onComplete(err, result);
		});
	};

	var voteOnForm = function (data, onComplete) {
		formDbObject.findById(data.voteData.formId, function (err, form) {
			for (var j = 0; j < form.formOptions.length; j++) {
				var requesterVotePos = form.formOptions[j].votes.indexOf(data.requestedBy);
				if(requesterVotePos >= 0)
					form.formOptions[j].votes.splice(requesterVotePos, 1);
				for(var i = 0; i < data.voteData.selectedOptions.length; i++) {
					if (form.formOptions[j]._id != data.voteData.selectedOptions[i])
						continue;
					form.formOptions[j].votes.push({votedBy: data.requestedBy});
					break;
				}
			}
			form.save(function (err, form) {
				onComplete(err, form);
			});
		});
	};

	var createForm = function (data, onComplete) {
		var item = new formDbObject({
			name: data.formData.name,
			description: data.formData.description,
			type: data.formData.type,
			isActive: data.formData.isActive,
			formOptions: data.formData.formOptions,
			createdBy: data.requestedBy
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
		findUserById: findUserById,
		getOrCreateUser: getOrCreateUser,

		getList: getList,
		getForm: getForm,
		getFormView: getFormView,
		voteOnForm: voteOnForm,
		createForm: createForm,
		updateForm: updateForm,
		deleteForm: deleteForm
	}
};