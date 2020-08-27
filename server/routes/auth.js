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
router.post('/signup', userController.signup)

// 로그인 2
router.post('/signin', userController.signin)

// 이메일 인증 3
router.post('/email', userController.email)

// 아이디 찾기 4
router.post('/find-email', userController.findEmail)

// 홈 유저 정보 가져오기 5
router.get('/user', authUtil, userController.getUser)

// 유저 닉네임-사진 가져오기 6
router.get('/user/nickname-picture', authUtil, userController.getNicknamePicture)

// 유저 개인정보 가져오기 7
router.get('/user/personal', authUtil, userController.getPersonal)

// 회원가입 때 유저 사진 넣기 ( 구현 X ) 8
router.put('/profile', authUtil, upload.single('profile'), userController.profileSignup)

// test case에 password salt 넣기
router.post('/insertSalt', userController.insertSalt)

//유저 정보 삭제
router.delete('/user', authUtil, userController.deleteUser)

//유저 이메일 패스워드 바꾸기
router.put('/user/email-pw',authUtil,userController.updateUserEmailAndPassword)

//유저 프로필 정보 바꾸기
router.put('/user/profile',authUtil,userController.updateProfile)

router.get('/user/all-nickname',userController.getAllNickname)

// to do : 회원가입 때 img 넣기, profile multer 붙이기 
// 구현 못한 api 5-6개 정도 되는 듯 그거 구현 
// 하나씩 test 하면서 responseMessage update
// 구현하고 수정한 api에 따른 git-wiki upload
// 4-5시간정도 소요될듯


/*
// 카카오 ( 보류 )
router.get("/kakao", passport.authenticate("kakao-login"));


router.get("/auth/kakao/callback",
  passport.authenticate("kakao-login", {
    successRedirect: '/auth/login/success',
    failureRedirect: '/auth/login/fail'
  })
);


router.get('/login/fail', (req, res) => {
  return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.CREATED_USER))
});

router.get('/login/success', (req, res) => {
  return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.CREATED_USER))
});

/*
보류

router.put('/user/alarm',authUtil,userController.updateAlarm)
router.put('/user/personal',authUtil,userController.updatePersonal)
router.put('/user/email',authUtil,userController.updateEmail)
*/



module.exports = router;