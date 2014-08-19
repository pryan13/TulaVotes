module.exports = function(config) {
	var dbObject = require('./scheme')(config),
		userDbObject = dbObject.userObject,
		formDbObject = dbObject.formObject,
		activityDbObject = dbObject.activityObject;

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

	var nonExpired = function(query){
		var now = new Date();
		query = query.where({$or: [{expireAt: {$gte: now}},  {expireAt: {$exists: false}}]});
		return query;
	};

	var getList = function (data, onComplete) {
		var qParam = {};
		if(data.formOwner)
			qParam.createdBy = data.formOwner;
		if(data.getActiveOnly)
			qParam.isActive = data.getActiveOnly;
		var query = formDbObject.find(qParam);
		if(data.getNotExpiredOnly)
			query = nonExpired(query);
		query.populate('createdBy', 'name').exec(function (err, forms) {
			var response = [];
			var currentDate = new Date();
			for(var i = 0; i < forms.length; i++){
				response[i] = forms[i].toJSON();
				response[i].isEditable = forms[i].isEditableBy(data.requestedBy);
				response[i].isExpired = !!forms[i].expireAt && forms[i].expireAt < currentDate;
			}
			onComplete(err, response);
		});
	};

	var getForm = function (id, onComplete) {
		formDbObject.findOne({_id: id}).select('-formOptions.votes').exec(function (err, form) {
			var response = form.toJSON();
			onComplete(err, response);
		});
	};

	var viewFormOptions = function (formOptions, requestedBy) {
		var hasAlreadyVotedOnForm = false,
			viewFormOptions =[];
		for (var i = 0; i < formOptions.length; i++) {
			var hasAlreadyVoted = false;
			for (var j = 0; j < formOptions[i].votes.length; j++) {
				if (formOptions[i].votes[j].votedBy.toString() !== requestedBy)
					continue;
				hasAlreadyVotedOnForm = hasAlreadyVoted = true;
				break;
			}
			viewFormOptions.push({
				_id: formOptions[i]._id,
				text: formOptions[i].text,
				checked: hasAlreadyVoted,
				votesCount: formOptions[i].votes.length
			});
		}
		return {
			hasAlreadyVoted: hasAlreadyVotedOnForm,
			formOptions: viewFormOptions
		}
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
				addOptionOnVote: form.addOptionOnVote
			};
			var resOptions = viewFormOptions(form.formOptions, data.requestedBy);
			result.hasAlreadyVoted = resOptions.hasAlreadyVoted;
			result.formOptions = resOptions.formOptions;
			onComplete(err, result);
		});
	};

	var voteOnForm = function (data, onComplete) {
		formDbObject.findById(data.voteData.formId, function (err, form) {
			for (var j = 0; j < form.formOptions.length; j++) {
				for(var i = 0; i < data.voteData.selectedOptions.length; i++) {
					if (form.formOptions[j]._id != data.voteData.selectedOptions[i])
						continue;
					form.formOptions[j].votes.push({votedBy: data.requestedBy});
					break;
				}
			}
			if(data.voteData.newOption){
				form.formOptions.push({
					text: data.voteData.newOption,
					votes: [{votedBy: data.requestedBy}]
				});
			}
			form.save(function (err, form) {
				var resOptions = viewFormOptions(form.formOptions, data.requestedBy);
				onComplete(err, resOptions.formOptions);
			});
		});
	};

	var createForm = function (data, onComplete) {
		var item = new formDbObject({
			name: data.formData.name,
			description: data.formData.description,
			type: data.formData.type,
			isActive: !!data.formData.isActive,
			formOptions: data.formData.formOptions,
			createdBy: data.requestedBy,
			expireAt: data.formData.expireAt
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
			form.expireAt = data.expireAt;
			form.formOptions = data.formOptions;
			form.addOptionOnVote = data.addOptionOnVote;
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

	var trackActivity = function(data){
		var activity = new activityDbObject({
			invokedBy: data.requestedBy,
			act: data.activity
		});
		activity.save();
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
		deleteForm: deleteForm,
		trackActivity: trackActivity
	}
};