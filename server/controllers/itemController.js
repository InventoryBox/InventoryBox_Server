let responseMsg = require('../modules/responseMessage');
let statusCode = require('../modules/statusCode');
let util = require('../modules/util');
let Item = require('../models/item');
const crypto = require('crypto');
const jwt = require('../modules/jwt');

exports.getOrderNumber=async(req,res)=>{
    const userIdx = req.idx;

    const categoryIdx = req.params.categoryIdx;

    if(userIdx === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMsg.NULL_VALUE));
    }

    const result = await Item.getMemoOrder(userIdx,categoryIdx)
}
exports.getAllItem=async(req,res)=>{
    
}
exports.getFiveDaysItem=async(req,res)=>{
    
}
exports.updateOrderMemo=async(req,res)=>{
    
}
