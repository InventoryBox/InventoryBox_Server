const express = require('express');
const router = express.Router();
const exchangeController= require('../controllers/exchangeController');

// 재고교환 홈화면 조회
router.get('/home/:category', exchangeController.home);
// 특정 게시글 조회 - 완료
router.get('/post/:postIdx', exchangeController.postView);

// 주소 변환 - 미정?
// router.get('/location/:longiti/:lati', exchangeController.itemAdd_Save);

// 사용자 찜 목록 - 완료
router.get('/favorite', exchangeController.searchUserLikes);

// 사용자 게시글 조회 - 없어도 됌
// router.get('/post-modify', exchangeController.deleteItem);

// 게시글 수정 화면 - 완료
router.get('/post/modify/:postIdx', exchangeController.modifyPost_View);

// 게시글 수정 저장 - 완료
router.post('/post/modify', exchangeController.modifyPost);

// 게시글 등록(기본정보 불러오기) - 완료
router.get('/user-info', exchangeController.searchUserInfo);

// 게시글 검색 - 진행중(거리 계산 후 추가 예정)
router.get('/search/:productName', exchangeController.searchPost);

// 게시글 등록 - 완료
router.post('/post', exchangeController.postSave);

// 게시글 거래 상태 변경 -완료
router.put('/post/modifyStatus', exchangeController.modifyIsSold);

// 게시글 좋아요 설정 변경 - 완료
router.put('/post/like-status', exchangeController.modifyLikes);   

// 게시글 삭제

module.exports = router;
