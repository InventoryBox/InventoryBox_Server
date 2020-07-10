var express = require('express')
var router = express.Router();

const itemController = require('../../controllers/itemController')

const authUtil = require('../../middlewares/auth').checkToken


router.get('/order/memo/:categoryIdx',authUtil,itemController.getOrderNumber)
router.get('/category',authUtil,itemController.getCategoryInfo)

router.put('/order/memo',authUtil,itemController.updateOrderMemo)
router.get('/:categoryIdx',authUtil,itemController.getItemInfo)

// router.get('/name/:name',authUtil,itemController.getItemIdx)

//

router.get('/five-days/:itemidx',authUtil,itemController.getFiveDaysItem)

// router.get('/',authUtil,itemController.getAllItem)




module.exports=router;