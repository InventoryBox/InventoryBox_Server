var express = require('express')
var router = express.Router();

const userController = require('../../controllers/userController')

const authUtil = require('../../middlewares/auth').checkToken


router.post('/signup',userController.signup)
router.post('/signin',userController.signin)
router.post('/email',userController.email)
router.post('/find-id	',userController.find_id)

router.get('/user',authUtil,userController.getUser)
router.get('/user/nickname-picture',authUtil,userController.getNicknamePicture)
router.get('/user/personal',authUtil,userController.getPersonal)

router.put('/user/alarm',authUtil,userController.updateAlarm)
router.put('/user/personal',authUtil,userController.updatePersonal)
router.put('/user/email',authUtil,userController.updateEmail)
router.put('/user/profile',authUtil,userController.updateProfile)

router.delete('/user',authUtil,userController.deleteUser)

module.exports=router;