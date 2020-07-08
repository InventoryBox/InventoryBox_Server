const express = require('express');
const router = express.Router();
const recordController= require('../controllers/recordController');
// 홈 & 기록수정 화면 조회
router.get('/record/home/:select/:date', recordController.signup);
// 카테고리 정보 조회
router.get('/record/folder/category-info', recordController.signup);
// 재료추가 화면 조회!
router.get('/record/item-add', recordController.signin);

// 재료추가 저장! 
router.post('/record/item-add', recordController.signup);

// 폴더 완료!(카테고리 추가, 이동, 재료 삭제)
router.put('/record/folder/category-save', recordController.signin);
// 오늘 재고 기록하기 화면 조회
router.put('/record/today/:select', recordController.signin);
// 기록수정 & 오늘재고기록 완료!
router.put('/record/modify', recordController.signin);


module.exports = router;
