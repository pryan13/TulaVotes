module.exports = function(config) {
	var dbObject = require('./scheme')(config),
		userDbObject = dbObject.userObject,
		formDbObject = dbObject.formObject,
		activityDbObject = dbObject.activityObject,
		tagDbObject = dbObject.tagObject;
	var async = require('async');

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
		query.select('-formOptions.votes').populate('createdBy', 'name').populate('tags', 'name').exec(function (err, forms) {
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
		formDbObject.findOne({_id: id}).select('-formOptions.votes').populate('tags', 'name').exec(function (err, form) {
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
		formDbObject.findOne({_id: data.formId}).populate('createdBy', 'name').populate('tags', 'name').exec(function (err, form) {
			var result = {
				_id: form._id,
				name: form.name,
				description: form.description,
				createdBy: form.createdBy.name,
				createdAt: form.createdAt,
				type: form.type,
				addOptionOnVote: form.addOptionOnVote,
				tags: form.tags
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
		saveFormTags(data.formData.tags, function (err, tagIds) {
			var item = new formDbObject({
				name: data.formData.name,
				description: data.formData.description,
				type: data.formData.type,
				isActive: !!data.formData.isActive,
				formOptions: data.formData.formOptions,
				createdBy: data.requestedBy,
				expireAt: data.formData.expireAt,
				addOptionOnVote: data.formData.addOptionOnVote,
				tags: tagIds
			});
			item.save(function (err, form) {
				getForm(form._id, onComplete);
			});
		});
	};

	var saveFormTags = function(tags, onComplete){
		async.map(tags, function(tag, callback){
			if(!tag._id) {
				new tagDbObject({name: tag.name, count: 1})
					.save(function (err, savedTag) {
						callback(err, savedTag._id);
					});
			}
			else{
				tagDbObject.findById(tag._id, function(err, foundTag){
					//foundTag.count += 1;
					foundTag.save(function (err, savedTag) {
						callback(err, savedTag._id);
					});
				});
			}
		}, function(err, results){
			onComplete(err, results);
		});
	};

	var attachTag = function(tag, callback){
		if(!tag._id) {
			new tagDbObject({name: tag.name, count: 1})
				.save(function (err, savedTag) {
					callback(err, savedTag._id);
				});
		}
		else{
			tagDbObject.findById(tag._id, function(err, foundTag){
				foundTag.count += 1;
				foundTag.save(function (err, savedTag) {
					callback(err, savedTag._id);
				});
			});
		}
	};

	var detachTag = function(tag, callback){
		tagDbObject.findById(tag._id, function(err, foundTag){
			foundTag.count -= 1;
			foundTag.save(function (err, savedTag) {
				callback(err, null);
			});
		});
	};

	var updateForm = function (data, onComplete) {
		async.waterfall([
			function(callback){
				formDbObject.findById(data._id, function (err, form) {
					callback(err, form, data);
				});
			},
			function(form, inputData, callback){
				var ttp = [];
				var tagIdsToSkip = [];
				var newTags = inputData.tags;
				for(var i = 0; i < newTags.length; i++){
					//attach new tag
					if(!newTags[i]._id || form.tags.indexOf(newTags[i]._id) < 0){
						newTags[i].action = 'attach';
					}
					else{
						newTags[i].action = 'skip';
						tagIdsToSkip.push(newTags[i]._id);
					}
					ttp.push(newTags[i])
				}
				for(var i = 0; i < form.tags.length; i++){
					if(tagIdsToSkip.indexOf(form.tags[i]) >= 0)
						continue;
					ttp.push({_id: form.tags[i], action: 'detach'});
				}
				async.map(ttp, function(tag, callback) {
					if (tag.action == 'attach') {
						if (!tag._id) {
							new tagDbObject({name: tag.name, count: 1})
								.save(function (err, savedTag) {
									callback(err, savedTag._id);
								});
						}
						else {
							tagDbObject.findById(tag._id, function (err, foundTag) {
								foundTag.count += 1;
								foundTag.save(function (err, savedTag) {
									callback(err, savedTag._id);
								});
							});
						}
					}
				}, function(err, results){
					callback(err, form, inputData, results);
				});
			},
			function(form, inputData, tagIds, callback){
				form.name = inputData.name;
				form.description = inputData.description;
				form.type = inputData.type;
				form.isActive = inputData.isActive;
				form.expireAt = inputData.expireAt;
				form.formOptions = inputData.formOptions;
				form.addOptionOnVote = inputData.addOptionOnVote;
				form.tags = tagIds;
				form.save(function (err, form) {
					callback(err, form._id);
				});
			}
		], function(err, formId){
			getForm(formId, onComplete);
		});

		saveFormTags(data.tags, function (err, tagIds) {
			formDbObject.findById(data._id, function (err, form) {
				form.name = data.name;
				form.description = data.description;
				form.type = data.type;
				form.isActive = data.isActive;
				form.expireAt = data.expireAt;
				form.formOptions = data.formOptions;
				form.addOptionOnVote = data.addOptionOnVote;
				form.tags = tagIds;
				form.save(function (err, form) {
					getForm(form._id, onComplete);
				});
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

	var getTagCloud = function(onComplete){
		async.waterfall([
			function(callback){
				formDbObject.count({}, function(err, count) {
					callback(err, count);
				});
			},
			function(formsCount, callback){
				tagDbObject.find(function (err, tags) {
					var result = [];
					for (var i = 0; i < tags.length; i++) {
						if(tags[i].count == 0)
							continue;
						result.push({
							_id: tags[i]._id,
							name: tags[i].name,
							grade: ~~((tags[i].count / formsCount) / (1/6))
						});
					}
					callback(err, result);
				});
			}
		], function(err, result){
			onComplete(err, result);
		});
	};

	var getTagList = function(query, onComplete){
		tagDbObject.find({name: new RegExp(query, 'i')}).exec(function(err, tagList){
			var result = [];
			for(var i = 0; i < tagList.length; i++){
				result.push(tagList[i].toJSON());
			}
			onComplete(err, result);
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
		deleteForm: deleteForm,
		trackActivity: trackActivity,
		getTagList: getTagList,
		getTagCloud: getTagCloud
	}
};