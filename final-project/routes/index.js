var express = require('express');
var router = express.Router();

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// exports.index = function(req, res){
//   res.render('index', { title: 'ejs' });};

module.exports = router;
