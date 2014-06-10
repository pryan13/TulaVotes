var mongoose = require('mongoose');
mongoose.connect(
	process.env.OPENSHIFT_MONGODB_DB_URL
		? process.env.OPENSHIFT_MONGODB_DB_URL + 'nodejs'
		: 'mongodb://localhost/tulaVotes');

var formSchema = new mongoose.Schema({
	name: String,
	description: String,
	type: { type: String, enum: ['radio', 'checkbox'] },
	isActive: Boolean
});

var Form = mongoose.model('Form', formSchema);

module.exports = Form;