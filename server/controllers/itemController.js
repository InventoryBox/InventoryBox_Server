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

    if(result === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.GET_USER_SUCCESS,{result:result}))

}
exports.getCategoryInfo=async(req,res)=>{
    const userIdx = req.idx;

    if(userIdx === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMsg.NULL_VALUE));
    }

    const result = await Item.getCategoryInfo()

    if(result === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.GET_USER_SUCCESS,{result:result}))

}

exports.updateOrderMemo=async(req,res)=>{
    const userIdx = req.idx;

    const{
        itemIdx,memoCnt
    } = req.body

    if(userIdx === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMsg.NULL_VALUE));
    }
    
    if(!itemIdx || !memoCnt ){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMsg.NULL_VALUE))
    }
    
    const result = await Item.updateOrderMemo(itemIdx,memoCnt)
    console.log(result)

    if(result === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.UPDATE_MEMO_COUNT_SUCCESS,{result:result.protocol41}))

}

exports.getAllItem=async(req,res)=>{
    const userIdx = req.idx;

    if(userIdx === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMsg.NULL_VALUE));
    }

    const result = await Item.getAllItem(userIdx)

    if(result === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.GET_ALL_ITEM_SUCCESS,{result:result}))
}


exports.getFiveDaysItem=async(req,res)=>{
    
}

