module.exports = function(config) {
	var mongoose = require('mongoose');

	mongoose.connect(config.db().uri);

	var userSchema = new mongoose.Schema({
		name: {type: String, required: 'Field {PATH} is required!'},
		email: {type: String, required: 'Field {PATH} is required!', unique: true}
	});

	userSchema.path('email').validate(function(email){
		return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
	}, 'The email provided has wrong format!');

	var User = mongoose.model("User", userSchema);

	var formSchema = new mongoose.Schema({
		name: {type: String, trim: true, required: 'Form name is required!'},
		description: {type: String, trim: true, required: 'Form description is required!'},
		tags: {type: [String]},
		type: {type: String, enum: ['radio', 'checkbox'], default: 'radio' },
		isActive: {type: Boolean, default: false},
		addOptionOnVote: {type: Boolean, default: false},
		formOptions: {
			type: [{
				text: {type: String, trim: true, required: 'Option text is required!'},
				votes: {
					type: [{
						votedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
						votedAt: {type: Date, default: Date.now}
					}]
				}
			}],
			required: 'Form should contain at least one option!'
		},
		createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		createdAt: {type: Date, default: Date.now},
		expireAt: {type: Date}
	});

	formSchema.methods.isEditableBy = function(editorId){
		return this.populated('createdBy').toString() === editorId;
	};

	var Form = mongoose.model('Form', formSchema);

	var tagSchema = new mongoose.Schema({
		name: {type: String, trim: true, required: 'Tag name is required!'}
	});

	var Tag = mongoose.model('Tag', tagSchema);

	var activityScheme = mongoose.Schema({
		invokedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		invokedAt: {type: Date, default: Date.now},
		act: String
	});

	var Activity = mongoose.model('Activity', activityScheme);

	return {
		userObject: User,
		formObject: Form,
		tagObject: Tag,
		activityObject: Activity
	};
};