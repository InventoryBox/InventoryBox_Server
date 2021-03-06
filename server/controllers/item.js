let responseMsg = require('../modules/responseMessage');
let statusCode = require('../modules/statusCode');
let util = require('../modules/util');
let Item = require('../models/item');
const crypto = require('crypto');
const jwt = require('../modules/jwt');
const item = require('../models/item');

exports.getOrderNumber = async (req, res) => {
    const userIdx = req.idx;
    const categoryIdx = req.params.categoryIdx;

    if (userIdx === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.NULL_VALUE));
    }
    const result = await Item.getMemoOrder(userIdx, categoryIdx);

    if (result === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }
    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.GET_USER_SUCCESS, {
        result: result
    }))
}
exports.getCategoryInfo = async (req, res) => {
    const userIdx = req.idx;

    if (userIdx === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.NULL_VALUE));
    }

    const result = await Item.getCategoryInfo(userIdx)

    if (result === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.GET_USER_SUCCESS, {
        result: result
    }))

}

exports.updateOrderMemo = async (req, res) => {
    const userIdx = req.idx;

    const {
        itemIdx,
        memoCnt
    } = req.body

    if (userIdx === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.ITEM_NULL_USER_IDX));
    }

    if (!itemIdx || !memoCnt) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.ITEM_NULL_VALUE))
    }

    const result = await Item.updateOrderMemo(itemIdx, memoCnt)
    //console.log(result)

    if (result === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.UPDATE_MEMO_COUNT_SUCCESS, {
        result: result.protocol41
    }))

}

exports.updateOrderMemoIOS = async(req,res)=>{
    const userIdx = req.idx;
    if (userIdx === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.ITEM_NULL_USER_IDX));
    }
    const {
        itemInfo
    } = req.body
    for (var a in itemInfo) {
        if (!itemInfo[a].itemIdx || !itemInfo[a].memoCnt) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.ITEM_NULL_VALUE))
        }
        const result = await Item.updateOrderMemo(itemInfo[a].itemIdx, itemInfo[a].memoCnt);
        if (result === null) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
        }
    }
    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.ITEM_UPDATE_MEMO_COUNT_SUCCESS))
}

exports.getItemInfo = async (req, res) => {
    const userIdx = req.idx;

    if (userIdx === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.ITEM_NULL_USER_IDX));
    }
    const result = await Item.getItemInfo(userIdx)

    if (result === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    function dateToString(DateFunction) {
        var month = (DateFunction.getMonth() + 1) < 10 ? '0' + (DateFunction.getMonth() + 1) : (DateFunction.getMonth() + 1);
        var day = DateFunction.getDate() < 10 ? '0' + DateFunction.getDate() : DateFunction.getDate();
        var date = DateFunction.getFullYear() + '-' + month + '-' + day;
        return date;
    }
    function pre5daysFromDay(lastDay) {
        var prev_dates = new Array();
        for (var i = 0; i < 5; i++)
            prev_dates[i] = new Date(lastDay - i * 24 * 60 * 60 * 1000);
        return prev_dates;
    }

    var date_send = await item.searchLastDate(userIdx);

    const lastDay = new Date(date_send);
    var week = pre5daysFromDay(lastDay);
    for (var j = 0; j < result.length; j++) {
        var itemIdx = result[j].itemIdx;
        var stocksInfo = new Array(5);
        for (var i = 0; i < 5; i++) {
            var StockResult = await Item.getStocksInfoOfDay(itemIdx, dateToString(week[i]));
            if (StockResult == -1) stocksInfo[i] = StockResult;
            else stocksInfo[i] = StockResult[0].stocksCnt;
        }
        result[j].lastDay = lastDay.getDay();
        result[j].stocksInfo = stocksInfo
    }

    for(i in result){
        delete result[i].userIdx
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.ITEM_GET_ITEM_INFO_SUCCESS, {
        result: result
    }))
}

exports.fiveDays = async (req, res) => {

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

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.GET_FIVE_DAYS_SUCCESS, {
        stocksInfo: stocksInfo
    }));

}

exports.pushFlag = async (req, res) => {

    const itemIdx = req.params.itemIdx;
    const flag = req.params.flag;


    if (!itemIdx || flag > 1 || flag < 0) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMsg.NULL_VALUE));
    }

    const result = await item.pushFlag(itemIdx, flag);

    if (result === null) {
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMsg.DB_ERROR))
    }

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.ITEM_PUSH_FLAG_SUCCESS))

}


exports.dummy=async(req,res)=>{

    const result = await item.dummy()

    return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMsg.DUMMY,{result:result.protocol41}))

}