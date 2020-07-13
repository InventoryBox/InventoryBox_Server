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

exports.getItemInfo=async(req,res)=>{
    const userIdx = req.idx;

    let result2;

    if(userIdx === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,responseMsg.NULL_VALUE));
    }

    const result = await Item.getItemInfo(userIdx)

    if(result === null){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR,responseMsg.DB_ERROR))
    }

    // for(var a in result)
    // {
    //     result[a].img1 = img1;
    // }  추가

    // for(var a in result)
    // {
    //     delete result[a].iconIdx
    //     delete result[a].categoryIdx
    //     delete result[a].userIdx
    // }

    // console.log(typeof(result[0].date))

   

 
    // console.log(stocksInfo)

    // for(var a in result)
    // {
    //     result[a].stocksInfo =stocksInfo;
    // } 

    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.GET_ITEM_INFO_SUCCESS,{result:result}))
}

exports.fiveDays=async(req,res)=>{
    
    const userIdx = req.idx;
    const itemIdx = req.params.itemIdx;
    

    function dateToString(DateFunction) {
        var month = (DateFunction.getMonth() + 1) < 10 ? '0' + (DateFunction.getMonth() + 1) : (DateFunction.getMonth() + 1);
        var day = DateFunction.getDate() < 10 ? '0' + DateFunction.getDate() : DateFunction.getDate();
        var date = DateFunction.getFullYear() + '-' + month + '-' + day;
        return date;
    }

    function pre5daysFromToday() {
        var prev_dates = new Array();
        for (var i = 0; i < 5; i++)
            prev_dates[i] = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        return prev_dates;
    }
    
    var week = pre5daysFromToday();

    var stocksInfo = new Array(5);

    for (var i = 0; i < 5; i++) {
                    const result = await Item.getStocksInfoOfDay(itemIdx, dateToString(week[i]));
                    if (result == -1) stocksInfo[i] = result;
                    else stocksInfo[i] = result[0].stocksCnt;
                }

    return res.status(statusCode.OK).send(util.success(statusCode.OK,responseMsg.GET_FIVE_DAYS_SUCCESS,{stocksInfo:stocksInfo}))

}