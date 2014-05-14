var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.sendfile('./views/index.html');
  //res.render('index', { title: 'Forms' });
});

module.exports = router;
