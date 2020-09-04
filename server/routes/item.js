var express = require('express')
var router = express.Router();

const itemController = require('../controllers/item')

const authUtil = require('../middlewares/auth').checkToken

// 발주 메모 정보 수정 Android 1
router.put('/order/memo',authUtil,itemController.updateOrderMemo)

// 발주 메모 정보 수정 ios 1 
router.put('/order/memo/ios',authUtil,itemController.updateOrderMemoIOS)

// 발주 메모 정보 가져오기 ( IF memoCnt > presentCnt ) 2
router.get('/order',authUtil,itemController.getItemInfo)

// flag 넣기 3
router.put('/flag/:itemIdx/:flag',itemController.pushFlag)


module.exports=router;


// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ보류ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ //
router.get('/dummy',itemController.dummy)

// item index에 따라 5일간 발주량 제공
router.get('/five-days/:itemIdx',authUtil,itemController.fiveDays)

// 카테고리에 따른 재고 반환 ( x )
router.get('/order/memo/:categoryIdx',authUtil,itemController.getOrderNumber);

// 카테고리 전체 정보 반환
router.get('/category',authUtil,itemController.getCategoryInfo)
// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ보류ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ //
