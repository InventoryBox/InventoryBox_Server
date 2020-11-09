var express = require('express')
var router = express.Router();
var passport = require('../config/kakao').passport;
//임시
let responseMsg = require('../modules/responseMessage');
let statusCode = require('../modules/statusCode');
let util = require('../modules/util');
const upload = require('../modules/multer')
const userController = require('../controllers/user')

const authUtil = require('../middlewares/auth').checkToken

// 회원가입 1
router.post('/signup',upload.single('img'),userController.signup)

// 로그인 2
router.post('/signin', userController.signin)

// 이메일 인증 3
router.post('/email/signup', userController.emailSignup)

router.post('/email/setpw', userController.setPw)

// 이메일 찾기 4
router.post('/find-email', userController.findEmail)

//유저 정보 삭제 5
router.delete('/user', authUtil, userController.deleteUser)

// 유저 닉네임 중복 확인 6
router.post('/nickname',userController.checkNickname)

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 햄버거 바 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ  //

// 이메일 비밀번호 변경 7
router.put('/user/pw',userController.updateUserPassword)

// 유저 닉네임-사진-사업자 이름  ( 프로필 ) 가져오기 8
router.get('/user/profile', authUtil, userController.getProfile)

//프로필 변경 9
router.put('/user/profile',authUtil,upload.single('img'),userController.updateProfile)

//개인정보 변경 10
router.put('/user/personal',authUtil,userController.updatePersonalInfo)

//개인정보 가져오기 11
router.get('/user/personal',authUtil,userController.getPersonal)

// 내가 쓴 게시글 12
router.get('/user/post',authUtil,userController.getUserPost)

// 내가 쓴 게시글 13 ios
router.get('/user/post/ios',authUtil,userController.getUserPostIos)

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 햄버거 바 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ  //

// password salt 넣기
router.post('/insertSalt', userController.insertSalt)


// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 회원가입 step별로 , 보류 ㅡㅡㅡㅡㅡㅡ //
// 회원가입 step 1
router.post('/signup/email-pw',userController.signupEmailAndPassword)

// 회원가입 step 2
router.put('/signup/personal',userController.signupPersonalInfo)

// 회원가입 step 3
router.put('/signup/profile',upload.single('img'),userController.signupProfileInfo)

// 회원가입 step 4
router.put('/signup/assign',userController.signupAssign)

// 회원가입 img
router.put('/signup',authUtil,upload.single('img'),userController.uploadProfileImg)
// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ 회원가입 step별로 , 보류 ㅡㅡㅡㅡㅡㅡ //

module.exports = router;