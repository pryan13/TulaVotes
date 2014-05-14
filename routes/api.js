var express = require('express');
var router = express.Router();

var forms = [];

var guid = (function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
})();

/* GET rest api. */
router.get('/', function(req, res) {
    res.send('test');
});

router.get('/forms', function(req, res) {
    res.json(forms);
});

router.delete('/forms/:form_id', function(req, res) {
    var tmp = [];
    for (var i = 0; i < forms.length; i++) {
        if ( forms[i]._id != req.params.form_id ){
            tmp.push(forms[i])
        }
    }
    forms = tmp;
    res.json(forms);
});

router.post('/forms/:form_id', function(req, res) {
    res.json(forms);
});

router.post('/forms', function(req, res) {
    forms.push({_id: guid(), text: req.body.text});
    res.json(forms);
});

module.exports = router;
