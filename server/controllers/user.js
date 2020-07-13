let responseMsg = require('../modules/responseMessage');
let statusCode = require('../modules/statusCode');
let util = require('../modules/util');
let User = require('../models/user');
const crypto = require('crypto');
const jwt = require('../modules/jwt');

const smtpTransport = require('../config/email').smtpTransport
const number = require('../config/email').number

exports.signup= async(req,res)=>{
    const{
        email,
        password,
        nickname,
        repName,
        coName,
        phoneNumber
    } = req.body;

    if(!email || !password || !nickname || !repName || !coName ||!phoneNumber){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMsg.NULL_VALUE))
    }

    if(await User.checkUser(email)){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMsg.DUPLICATED_EMAIL))
    }

    const salt = crypto.randomBytes(32).toString()
    const hashedPw = crypto.pbkdf2Sync(password,salt,1,32,'sha512').toString('hex')

    const insertIdx = await User.signup(email,hashedPw,salt,nickname,repName,coName,phoneNumber)
    
    if(insertIdx==0){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.CREATED_USER,{insertIdx:insertIdx}))

}

exports.signin= async(req,res)=>{
    const{
        email,
        password
    } = req.body;

    if(!email || !password){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMsg.NULL_VALUE))
    }

    if(await User.checkUser(email) === false){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMsg.DB_ERROR))
    }

    const result = await User.signin(email,password)

    if(result === false){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMsg.DB_ERROR))
    }

    const userData = await User.getUserByEmail(email)

    const jwtToken = await jwt.sign(userData[0])

    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.LOGIN_SUCCESS,{token:jwtToken.token}))

}

exports.email= async(req,res)=>{
    const {sendEmail} = req.body;

  const mailOptions = {
    from: "재고창고",
    to: sendEmail,
    subject: "[재고창고]인증 관련 이메일 입니다",
    text: "오른쪽 숫자 6자리를 입력해주세요 : " + number
  };
  
 const result = await smtpTransport.sendMail(mailOptions, (error, responses) =>{
      if(error){
          res.json({msg:'err'});
      }else{
          res.json({"6자리 숫자":number});
      }
      smtpTransport.close();
  });
}

exports.find_id= async(req,res)=>{
    const{
        repName,
        coName,
        phoneNumber
    } = req.body;

    if(!repName || !coName || !phoneNumber){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMsg.NULL_VALUE))
    }

    const findEmail = await User.findEmail(repName,coName,phoneNumber)

    if(findEmail===null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMsg.DB_ERROR))
    }
    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.FIND_EMAIL_SUCCESS,{email:findEmail}))
}

exports.getUser= async(req,res)=>{
    const userIdx = req.idx

    if(userIdx === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMsg.NULL_VALUE))
    }

    const getUserData = await User.getUserByIdxCustom(userIdx)

    if(getUserData === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMsg.DB_ERROR))
    }


    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.GET_USER_SUCCESS,{email:getUserData}))

}

exports.getNicknamePicture= async(req,res)=>{
    const userIdx = req.idx

    if(userIdx === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMsg.NULL_VALUE))
    }

    const getUserData = await User.getUserByIdx(userIdx)

    if(getUserData === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.FIND_EMAIL_SUCCESS,{nickname:getUserData[0].nickname,img:getUserData[0].img}))
}


exports.deleteUser= async(req,res)=>{
    const userIdx = req.idx

    if(userIdx === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMsg.NULL_VALUE))
    }

    const result = await User.deleteUser(userIdx)
    console.log(result)

    if(result.protocol41 === false){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.DELETE_SUCCESS,{result:result.protocol41}))
}

exports.getPersonal= async(req,res)=>{
    const userIdx = req.idx

    if(userIdx === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMsg.NULL_VALUE))
    }

    const result = await User.getPersonal(userIdx)

    if(result === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMsg.DB_ERROR))
    }
    
    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.GET_USER_SUCCESS,{result:result}))
}

exports.profileSignup=async(req,res)=>{
    User.updateImg()
}

exports.insertSalt=async(req,res)=>{

    const {
        password,
        userIdx
    }=req.body;
    
    const salt = crypto.randomBytes(32).toString()
    const hashedPw = crypto.pbkdf2Sync(password,salt,1,32,'sha512').toString('hex')

    const result = await User.insertSalt(hashedPw,salt,userIdx)

    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.SALT_PASSWORD_SUCCESS,{result:result}))
}

/*

보류



exports.updateAlarm= async(req,res)=>{

}

exports.updatePersonal= async(req,res)=>{

}

exports.updateEmail= async(req,res)=>{

}

exports.updateProfile= async(req,res)=>{

}

*/