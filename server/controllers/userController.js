let responseMsg = require('../modules/responseMessage');
let statusCode = require('../modules/statusCode');
let util = require('../modules/util');
let User = require('../models/user');
const crypto = require('crypto');
const jwt = require('../modules/jwt');

exports.signup= async(req,res)=>{
    const{
        email,
        password,
        nickname,
        repName,
        coName,
        img,
        longitude,
        latitude,
        location,
        phoneNumber,
        recordTime,
        orderTime,
        isSubscribed
    } = req.body;

    if(!email || !password || !nickname || !repName || !coName || !img || !longitude || !latitude || !location || !phoneNumber || !recordTime || !orderTime || !isSubscribed){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMsg.NULL_VALUE))
    }

    const salt = crypto.randomBytes(32).toString()
    const hashedPw = crypto.pbkdf2Sync(password,salt,1,32,'sha512').toString('hex')

    const result = await User.signup(email,hashedPw,salt,nickname,repName,coName,img,longitude,latitude,location,phoneNumber,recordTime,orderTime,isSubscribed)
    
    if(result==0){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.CREATED_USER,{insertIdx:result}))

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
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.DB_ERROR,responseMsg.DB_ERROR))
    }

    const userData = await User.getUser(email)

    const jwtToken = await jwt.sign(userData[0])

    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.LOGIN_SUCCESS,{token:jwtToken}))


}

exports.email= async(req,res)=>{

}

exports.find_id= async(req,res)=>{

}

exports.getUser= async(req,res)=>{

}

exports.getNicknamePicture= async(req,res)=>{

}

exports.getPersonal= async(req,res)=>{

}

exports.updateAlarm= async(req,res)=>{

}

exports.updatePersonal= async(req,res)=>{

}

exports.updateEmail= async(req,res)=>{

}

exports.updateProfile= async(req,res)=>{

}

exports.deleteUser= async(req,res)=>{

}



