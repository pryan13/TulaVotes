module.exports = function(config) {
	var mongoose = require('mongoose');

	mongoose.connect(config.db().uri);

	var userSchema = new mongoose.Schema({
		name: {type: String, required: 'Field {PATH} is required!'},
		email: {type: String, required: 'Field {PATH} is required!'}
	});

	var User = mongoose.model("User", userSchema);

	var formSchema = new mongoose.Schema({
		name: {type: String, required: 'Field {PATH} is required!'},
		description: {type: String, required: 'Field {PATH} is required!'},
		type: { type: String, enum: ['radio', 'checkbox'], default: 'radio' },
		isActive: {type: Boolean, default: false},
		formOptions: {
			type: [{
				text: {type: String, required: 'Field {PATH} is required!'},
				votes: {
					type: [{
						votedBy: {type: mongoose.Schema.Types.ObjectId, required: true},
						votedAt: {type: Date, default: Date.now}
					}]
				}
			}],
			required: 'Field {PATH} is required!'
		},
		createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		createdAt: {type: Date, default: Date.now}
	});

	var Form = mongoose.model('Form', formSchema);

	return {
		userObject: User,
		formObject: Form
	};
};