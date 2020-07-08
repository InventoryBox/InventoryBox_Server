var express = require('express')
var router = express.Router();

const itemController = require('../../controllers/itemController')

const authUtil = require('../../middlewares/auth').checkToken


router.get('/order/number/:categoryIdx',authUtil,itemController.getOrderNumber)

router.get('/',authUtil,itemController.getAllItem)
router.get('/five-days/:itemidx',authUtil,itemController.getFiveDaysItem)

router.put('/order/memo',authUtil,itemController.updateOrderMemo)


module.exports=router;