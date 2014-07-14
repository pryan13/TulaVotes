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
					type: [String]
				}
			}],
			required: 'Field {PATH} is required!'
		}
	});

	var Form = mongoose.model('Form', formSchema);

	return Form;
};