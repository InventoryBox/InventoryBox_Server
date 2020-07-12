var express = require('express')
var router = express.Router();
var passport = require('../../config/kakao').passport;

//임시
let responseMsg = require('../../modules/responseMessage');
let statusCode = require('../../modules/statusCode');
let util = require('../../modules/util');
const upload = require('../../modules/multer')
const userController = require('../../controllers/userController')

const authUtil = require('../../middlewares/auth').checkToken

router.post('/signup',userController.signup)
router.post('/signin',userController.signin)
router.post('/email',userController.email)
router.post('/find-id',userController.find_id)

router.get('/user',authUtil,userController.getUser)
router.get('/user/nickname-picture',authUtil,userController.getNicknamePicture)
router.get('/user/personal',authUtil,userController.getPersonal)

router.post('/profile',upload.single('profile'),userController.profileSignup)


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


