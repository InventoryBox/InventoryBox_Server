const User = require('../models/user')

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

    const result = User.signup(email,hashedPw,salt,nickname,repName,coName,img,longitude,latitude,location,phoneNumber,recordTime,orderTime,isSubscribed)
    
    if(result==0){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.CREATED_USER,{insertIdx:result}))

}

exports.signin= async(req,res)=>{

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



