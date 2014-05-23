var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect(
	process.env.OPENSHIFT_MONGODB_DB_URL
		? process.env.OPENSHIFT_MONGODB_DB_URL +'nodejs'
		: 'mongodb://localhost/tulaVotes');

var formSchema = new mongoose.Schema({
    text:  String
});
var Form = mongoose.model('Form', formSchema);

var forms = [];

/* GET rest api. */
router.get('/', function(req, res) {
    res.send('test');
});

router.get('/forms', function(req, res) {
    Form.find(function(err, forms){
        res.json(forms);
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
    res.json(forms);
});

router.post('/forms', function(req, res) {
    var item = new Form({ text: req.body.text });
    item.save(function (err) {
        if (err) console.log(err);
        Form.find(function(err, forms){
            res.json(forms);
        });
    });
});

module.exports = router;
