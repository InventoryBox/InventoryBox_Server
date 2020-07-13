var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.use('/auth', require('./auth'));
router.use('/dashboard', require('./dashboard'));
router.use('/exchange', require('./exchange'));
router.use('/record', require('./record'));
router.use('/item',require('./item'));

module.exports = router;

