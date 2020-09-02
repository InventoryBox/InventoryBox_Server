let responseMsg = require('../modules/responseMessage');
let statusCode = require('../modules/statusCode');
let util = require('../modules/util');
let User = require('../models/user');
const crypto = require('crypto');
const jwt = require('../modules/jwt');
const { truncate } = require('fs');
const { getUserByIdx } = require('../models/user');

const smtpTransport = require('../config/email').smtpTransport
const number = require('../config/email').number

exports.updateLoc = async (req, res) => {
    const userIdx = req.idx;
    // const userIdx = 1;
    const {
        address,
        latitude,
        longitude
    } = req.body;
    const result = await userModel.updateLoc(userIdx, address, latitude, longitude);
    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ADD_LOC_SUCCESS));
}

exports.uploadProfileImg = async(req,res)=>{
    const userIdx = req.idx
    const img = req.file.location;

    if (userIdx === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_USER_IDX_NULL))
    }

    // if(img){
    //     const type = req.file.mimetype.split('/')[1];  

    //     if (type !== 'jpeg' && type !== 'jpg' && type !== 'png') { 
    //         return res.status(CODE.OK).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_TYPE_ERROR));
    //     }
    // }

    const result = await User.updateImg(userIdx,img)

    if (!result) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.AUTH_UPLOAD_PROFILE_IMG_SUCCESS,{
        result:result
    }))
}

exports.signup = async (req, res) => {
    var img='';
    if(req.file !== undefined)
        img = req.file.location;
    
    const {
        email,
        password,
        nickname,
        repName,
        coName,
        phoneNumber,
        pushAlarm
    } = req.body;

    if (!email || !password || !nickname || !repName || !coName || !phoneNumber) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.NULL_VALUE))
    }  

     if (await User.checkUser(email)) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_DUPLICATED_EMAIL))
    } 

    const salt = crypto.randomBytes(32).toString()
    const hashedPw = crypto.pbkdf2Sync(password, salt, 1, 32, 'sha512').toString('hex')

    console.log("ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ")
    console.log(email,password,nickname,repName,coName,phoneNumber)
    console.log("ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ")
    const insertIdx = await User.signup(email, hashedPw, salt, nickname, repName, coName, phoneNumber,pushAlarm,img)
    //console.log(insertIdx);

    if (insertIdx == 0) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.AUTH_CREATED_USER,{
        insertIdx:insertIdx
    }))
}

exports.signin = async (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (!email || !password) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_LOGIN_NULL_VALUE))
    }

    if (await User.checkUser(email) === false) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_LOGIN_ERROR))
    }

    const result = await User.signin(email, password)

    if (result === false) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    const userData = await User.getUserByEmail(email)

    const jwtToken = await jwt.sign(userData[0])

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.LOGIN_SUCCESS, {
        token: jwtToken.token
    }))

}

exports.email = async (req, res) => {
    const {
        sendEmail
    } = req.body;

    const mailOptions = {
        from: "재고창고",
        to: sendEmail,
        subject: "[재고창고]인증 관련 이메일 입니다",
        text: "오른쪽 숫자 6자리를 입력해주세요 : " + number
    };

    const result = await smtpTransport.sendMail(mailOptions, (error, responses) => {
        if (error) {
            return res.status(statusCode.OK).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_EMAIL_FAIL))
        } else {
            return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.AUTH_EMAIL_SUCCESS, {
                number: number
            }))
        }
        smtpTransport.close();
    });
}

exports.findEmail = async (req, res) => {
    const {
        repName,
        coName,
        phoneNumber
    } = req.body;

    if (!repName || !coName || !phoneNumber) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_FIND_ID_NULL_VALUE))
    }

    const findEmail = await User.findEmail(repName, coName, phoneNumber)

    if (findEmail.length<1) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }
    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.FIND_EMAIL_SUCCESS, {
        email: findEmail
    }))
}

exports.getProfile = async (req, res) => {
    const userIdx = req.idx

    if (userIdx === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_USER_IDX_NULL))
    }

    const getUserData = await User.getUserByIdx(userIdx)

    if (getUserData === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.AUTH_GET_NICKNAME_AND_PICTURE_SUCCESS, {
        nickname: getUserData[0].nickname,
        img: getUserData[0].img,
        coName:getUserData[0].coName
    }))
}


exports.deleteUser = async (req, res) => {
    const userIdx = req.idx

    if (userIdx === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_USER_IDX_NULL))
    }

    const result = await User.deleteUser(userIdx)
    //    console.log(result)

    if (result === false) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.DELETE_SUCCESS, {
        result: result
    }))
}



exports.insertSalt = async (req, res) => {
    const {
        password,
        userIdx
    } = req.body;

    const salt = crypto.randomBytes(32).toString()
    const hashedPw = crypto.pbkdf2Sync(password, salt, 1, 32, 'sha512').toString('hex')

    const result = await User.insertSalt(hashedPw, salt, userIdx)

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.SALT_PASSWORD_SUCCESS, {
        result: result
    }))
}

exports.updateUserEmailAndPassword = async(req,res)=>{
    
    const userIdx = req.idx;
    
    const{
        updatedEmail,updatedPassword
    } = req.body;

    if (userIdx === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_USER_IDX_NULL))
    }

    if (!updatedEmail || !updatedPassword) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.NULL_VALUE))
    }

    const salt = crypto.randomBytes(32).toString()
    const hashedPw = crypto.pbkdf2Sync(updatedPassword, salt, 1, 32, 'sha512').toString('hex')

    const result = await User.updateUserEmailAndPassword(userIdx,updatedEmail,hashedPw)

    if (result === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.AUTH_UPDATE_EMAIL_AND_PW_SUCCESS, {
        result: result.protocol41
    }));
}

exports.updateProfile = async(req,res)=>{
    const userIdx = req.idx;
    const img = req.file.location;

    const {nickname} = req.body;
    
    if (userIdx === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_USER_IDX_NULL))
    }

    if (await User.checkNickname(nickname) === false) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_DUPLICATED_NICKNAME))
    }

    const result = await User.updateProfile(userIdx,nickname,img)

    if (result === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.AUTH_UPDATE_PROFILE_SUCCESS, {
        result: result
    }));
}


exports.signupEmailAndPassword = async(req,res)=>{
    const {
        email,password
    } = req.body;

    if (!email || !password) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.NULL_VALUE))
    }

    if (await User.checkUser(email)) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_DUPLICATED_EMAIL))
    } 

    const salt = crypto.randomBytes(32).toString()
    const hashedPw = crypto.pbkdf2Sync(password, salt, 1, 32, 'sha512').toString('hex')

    const insertIdx = await User.signupEmailAndPassword(email,hashedPw,salt)

    if (insertIdx === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.AUTH_SIGNUP_EMAIL_AND_PASSWORD_SUCCESS, {
        insertIdx: insertIdx
    }));
}

exports.signupPersonalInfo = async(req,res)=>{
    const {
        insertIdx,
        repName,
        coName,
        phoneNumber
    } = req.body;

    if (!insertIdx || !repName || !coName || !phoneNumber) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.NULL_VALUE))
    }

    const result = await User.signupPersonalInfo(insertIdx,repName,coName,phoneNumber)

    if (result === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.AUTH_SIGNUP_PERSONAL_INFO_SUCCESS, {
        insertIdx: insertIdx
    }));
}

exports.signupProfileInfo = async(req,res)=>{

    const img = req.file.location;

    const {
        insertIdx,
        nickname
    } = req.body;

    if (!insertIdx || !nickname) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.NULL_VALUE))
    }

    const result = await User.signupProfileInfo(insertIdx,nickname,img)

    if (result === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.AUTH_SIGNUP_PROFILE_INFO_SUCCESS, {
        insertIdx: insertIdx
    }));
}

exports.signupAssign = async(req,res)=>{
    const{
        insertIdx,
        pushAlarm,
    } = req.body;

    if (!insertIdx || !pushAlarm ) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.NULL_VALUE))
    }
    
    const result = await User.signupAssign(insertIdx,pushAlarm)

    if (result === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.AUTH_SIGNUP_ASSIGN_SUCCESS, {
        result: result
    }));
}

exports.updatePersonalInfo = async(req,res)=>{

    const userIdx = req.idx;

    if (userIdx === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_USER_IDX_NULL))
    }

    const{
        repName,
        coName,
        location,
        phoneNumber
    } = req.body;

    if (!coName || !repName || !phoneNumber) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.NULL_VALUE))
    }

    const result = await User.updatePersonalInfo(userIdx,repName,coName,location,phoneNumber)

    if (result === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.AUTH_UPDATE_PERSONAL_INFO_SUCCESS, {
        result: result
    }));
    
}

exports.checkNickname = async(req,res)=>{
    const {nickname} = req.body;

    if (!nickname) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.NULL_VALUE))
    }

    const result = await User.checkNickname(nickname)

    if (result === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    if(result=== true){
        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.AUTH_CHECK_NICKNAME_SUCCESS, {
            result: result
        }));
    }else{
        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.AUTH_CHECK_NICKNAME_FAIL, {
            result: result
        }));
    }

}

// 보류
exports.getPersonal = async (req, res) => {
    const userIdx = req.idx

    if (userIdx === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_USER_IDX_NULL))
    }

    const result = await User.getPersonal(userIdx)

    if (result === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.AUTH_GET_USER_SUCCESS, {
        result
    }))
}

exports.getUserPost = async(req,res)=>{
    const userIdx = req.idx

    if (userIdx === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.AUTH_USER_IDX_NULL))
    }

    const result = await User.getUserPost(userIdx)

    if (result === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.AUTH_GET_USER_POST_SUCCESS, {
        result:result
    }))
}