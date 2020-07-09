var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('/auth', require('./auth/auth'));
router.use('/dashboard', require('./dashboard/dashboard'));
router.use('/exchange', require('./exchange/exchange'));
router.use('/item', require('./item/item'));
router.use('/record', require('./record/record'));

module.exports = router;
