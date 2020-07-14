const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchange');
const authUtil = require('../middlewares/auth').checkToken
const upload = require('../modules/multer')
const userController = require('../controllers/user');


// 재고교환 홈화면 조회
router.get('/:filter', authUtil, exchangeController.home);

// 게시글 검색
router.get('/search/:keyword/:filter', authUtil, exchangeController.searchPost);

// 사용자 주소 수정
router.post('/modifyLoc', authUtil, exchangeController.updateLoc);

// 특정 게시글 조회 - 완료
router.get('/post/:postIdx', authUtil, exchangeController.postView);

// 사용자 찜 목록 - 완료
router.get('/favorite/list', authUtil, exchangeController.searchUserLikes);

// 사용자 게시글 조회 - 없어도 됌
// router.get('/post-modify', exchangeController.deleteItem);

// 게시글 수정 화면 - 완료
router.get('/post/modify/:postIdx', authUtil, exchangeController.modifyPost_View);

// 게시글 수정 저장 - 완료
router.post('/post/modify', authUtil, upload.single('productImg'), exchangeController.modifyPost);

// 게시글 등록(기본정보 불러오기) - 완료
router.get('/user/info', authUtil, exchangeController.searchUserInfo);

// 게시글 등록 - 완료
router.post('/post', authUtil, upload.single('productImg'), exchangeController.postSave);

// 게시글 거래 상태 변경 -완료
router.put('/post/modifyStatus', authUtil, exchangeController.modifyIsSold);

// 게시글 좋아요 설정 변경 - 완료
router.put('/post/like-status', authUtil, exchangeController.modifyLikes);

module.exports = router;