var mongoose = require('mongoose');
var config = require('../config/wrapper');
mongoose.connect(config.get('db:uri'));

var formSchema = new mongoose.Schema({
	name: String,
	description: String,
	type: { type: String, enum: ['radio', 'checkbox'] },
	isActive: Boolean
});

var Form = mongoose.model('Form', formSchema);

module.exports = Form;