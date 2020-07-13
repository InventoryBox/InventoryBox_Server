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
router.post('/signup',userController.signup)

// 로그인 2
router.post('/signin',userController.signin)

// 이메일 인증 3
router.post('/email',userController.email)

// 아이디 찾기 4
router.post('/find-id',userController.find_id)

// 홈 유저 정보 가져오기 5
router.get('/user',authUtil,userController.getUser)

// 유저 닉네임-사진 가져오기 6
router.get('/user/nickname-picture',authUtil,userController.getNicknamePicture)

// 유저 개인정보 가져오기 7
router.get('/user/personal',authUtil,userController.getPersonal)

// 회원가입 때 유저 사진 넣기 ( 구현 X ) 8
router.post('/profile',upload.single('profile'),userController.profileSignup)


// test case에 password salt 넣기
router.post('/insertSalt',userController.insertSalt)


// 카카오
router.get("/kakao", passport.authenticate("kakao-login"));


router.get(
  "/auth/kakao/callback",
  passport.authenticate("kakao-login", {
    successRedirect: '/auth/login/success',
    failureRedirect: '/auth/login/fail'
  })
);


router.get('/login/fail', (req, res) => {
  return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.CREATED_USER))
});

router.get('/login/success', (req, res) => {
  return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.CREATED_USER))
});

/*
보류

router.put('/user/alarm',authUtil,userController.updateAlarm)
router.put('/user/personal',authUtil,userController.updatePersonal)
router.put('/user/email',authUtil,userController.updateEmail)
router.put('/user/profile',authUtil,userController.updateProfile)
*/

router.delete('/user',authUtil,userController.deleteUser)

module.exports=router;


