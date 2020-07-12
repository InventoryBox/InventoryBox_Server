var express = require('express')
var router = express.Router();

const itemController = require('../../controllers/itemController')

const authUtil = require('../../middlewares/auth').checkToken

// 카테고리에 따른 재고 반환
router.get('/order/memo/:categoryIdx',authUtil,itemController.getOrderNumber)

// 카테고리 전체 정보 반환
router.get('/category',authUtil,itemController.getCategoryInfo)

// 발주 메모 정보 수정
router.put('/order/memo',authUtil,itemController.updateOrderMemo)

// 발주 메모 정보 가져오기 ( IF memoCnt > presentCnt )
router.get('/order',authUtil,itemController.getItemInfo)

// item index에 따라 5일간 발주량 제공
router.get('/five-days/:itemIdx',authUtil,itemController.fiveDays)

// router.get('/name/:name',authUtil,itemController.getItemIdx)

//

// router.get('/',authUtil,itemController.getAllItem)




module.exports=router;