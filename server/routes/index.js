var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/auth',require('../routes/auth'))
router.use('/item',require('../routes/item/'))


module.exports = router;
