var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect(
	process.env.OPENSHIFT_MONGODB_DB_URL
		? process.env.OPENSHIFT_MONGODB_DB_URL +'nodejs'
		: 'mongodb://localhost/tulaVotes');

var formSchema = new mongoose.Schema({
	name:  String,
	description:  String,
	type: { type: String, enum: ['radio', 'checkbox'] },
	isActive:  Boolean
});

var Form = mongoose.model('Form', formSchema);

/* GET rest api. */
router.get('/', function(req, res) {
    res.send('test');
});

router.get('/forms', function(req, res) {
    Form.find(function(err, forms){
        res.json(forms);
    });
});

router.get('/forms/:form_id', function(req, res) {
    Form.findById(req.params.form_id, function (err, doc) {
       res.json(doc);
    });
});

router.delete('/forms/:form_id', function(req, res) {
    Form.findById(req.params.form_id, function (err, doc) {
       doc.remove(function(){
           Form.find(function(err2, forms){
               res.json(forms);
           });
       });
    });
});

router.post('/forms/:form_id', function(req, res) {
	Form.findById(req.params.form_id, function (err, doc) {
		doc.name = req.body.name;
    	doc.description= req.body.description;
    	doc.type= req.body.type;
    	doc.isActive= req.body.isActive;
    	doc.save(function(err){
    		if (err) console.log(err);
    	    Form.find(function(err, forms){
    	        res.json(forms);
    	    });
    	});
	});   
});

router.post('/forms', function(req, res) {
	var item = new Form({        	
    	name: req.body.name,
    	description: req.body.description,
    	type: req.body.type,
    	isActive: req.body.isActive,
    });
	item.save(function(err){
		if (err) console.log(err);
	    Form.find(function(err, forms){
	        res.json(forms);
	    });
	});
});

module.exports = router;
