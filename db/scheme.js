module.exports = function(config) {
	var mongoose = require('mongoose');

	mongoose.connect(config.db().uri);

	var formSchema = new mongoose.Schema({
		name: String,
		description: String,
		type: { type: String, enum: ['radio', 'checkbox'], default: 'radio' },
		isActive: Boolean,
		formOptions: []
	});

	return mongoose.model('Form', formSchema);
};