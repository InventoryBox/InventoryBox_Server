const express = require('express');
const router = express.Router();
const recordController= require('../../controllers/recordController');
// 홈 & 기록수정 화면 조회
router.get('/home/:date', recordController.home);
// 카테고리 정보 조회
//router.get('/record/folder/category-info', recordController.searchCategory);
// 재료추가 화면 조회!
router.get('/item-add', recordController.itemAdd_View);

// 재료추가 저장! 
router.post('/item-add', recordController.itemAdd_Save);
// 카테고리 추가
router.post('/category-add', recordController.addCategory)
// 재료 삭제
router.delete('/item-delete', recordController.deleteItem);
// 오늘 재고 기록하기 화면 조회
router.get('/today', recordController.todayRecord_View);
// 기록수정 & 오늘재고기록 완료!
router.put('/modify', recordController.modifyItem);
// 기록수정 화면 조회
router.get('/modifyView/:date', recordController.modifyView);
module.exports = router;
