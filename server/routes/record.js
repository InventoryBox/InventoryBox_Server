const express = require('express');
const router = express.Router();
const recordController= require('../controllers/record');
const authUtil = require('../middlewares/auth').checkToken

// 홈 & 기록수정 화면 조회
router.get('/home/:date', authUtil, recordController.home);
// 카테고리 정보 조회
router.get('/folder/category-info', authUtil, recordController.searchCategory_All);
// 재료추가 화면 조회!
router.get('/item-add', authUtil, recordController.itemAdd_View);

// 재료추가 저장! 
router.post('/item-add', authUtil, recordController.itemAdd_Save);
// 카테고리 추가
router.post('/category-add', authUtil, recordController.addCategory);

// 카테고리 삭제 구현
// 재료 삭제
router.delete('/item-delete', authUtil, recordController.deleteItem);
// 오늘 재고 기록하기 화면 조회
router.get('/today', authUtil, recordController.todayRecord_View);
// 기록수정 & 오늘재고기록 완료!
router.put('/modify', authUtil, recordController.modifyItem);
// 기록수정 화면 조회
router.get('/modifyView/:date', authUtil, recordController.modifyView);
module.exports = router;
