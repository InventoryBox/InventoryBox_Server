const itemModel = require('../models/item');
const categoryModel = require('../models/category');
const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const encrypt = require('../modules/encryption');
const jwt = require('../modules/jwt');
const database = require('../config/database');
const {
    searchInfo
} = require('../models/item');

function replaceAll(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
}

const record = {
    home: async (req, res) => {
        // token에서 userIdx 파싱
        const userIdx = req.idx;
        const date = req.params.date;
        var categoryInfo = await categoryModel.searchInfoAll(userIdx);
        var addButton;
        var DateFunction = new Date();
        var month = (DateFunction.getMonth() + 1) < 10 ? '0' + (DateFunction.getMonth() + 1) : (DateFunction.getMonth() + 1);
        var day = DateFunction.getDate() < 10 ? '0' + DateFunction.getDate() : DateFunction.getDate();
        var date_is = DateFunction.getFullYear() + '-' + month + '-' + day;
        //console.log(date_is);
        var isRecorded = await itemModel.searchIsRecorded(date_is);
        // params 값 확인
        var week = new Array('일', '월', '화', '수', '목', '금', '토');
        if (!date) {
            res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else if (date == 0) {
            // 재고기록 탭 눌렀을 때
            // 가장 최근 저장된 DB날짜 필요
            var date_send = await itemModel.searchLastDate();
            // console.log(date_send);
            // 전체 카테고리(0) 값 조회
            const result = await itemModel.searchInfo_Date(date_send);
            //console.log(result);
            for (var a in result) {
                const iconImg = await itemModel.searchIcon_ItemIdx(result[a].itemIdx);
                result[a].img = iconImg[0].img;
                //console.log(result[a].itemIdx);   
            }
            var itemInfo = result;
            // isRecorded 정보 조회
            const lastDay = new Date(date_send);
            var yoil = week[lastDay.getDay()];
            if (date_is == date_send) {
                addButton = 1;
            } else {
                addButton = 0;
            }
            console.log(date_send);
            date_send = replaceAll(date_send, "-", ".");
            console.log(date_send);
            res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_HOME_SUCCESS, {
                itemInfo: itemInfo,
                categoryInfo: categoryInfo,
                isRecorded: isRecorded,
                date: date_send + " " + yoil + "요일",
                picker: 0,
                addButton: addButton
            }));
        } else {
            // 데이터 피커 눌렀을 때
            // 해당되는 date에 해당하는 item 조회
            const result = await itemModel.searchInfo_Date(date);
            for (var a in result) {
                const iconImg = await itemModel.searchIcon_ItemIdx(result[a].itemIdx);
                result[a].img = iconImg[0].img;
                //console.log(result[a].itemIdx);     
            }
            var itemInfo = result;
            // isRecorded 정보 조회
            var isRecorded = await itemModel.searchIsRecorded(date);
            // pircker = 1
            // addButton 계산
            if (date == date_is) {
                addButton = 1;
            } else {
                addButton = 0;
            }
            res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_HOME_SUCCESS, {
                itemInfo: itemInfo,
                categoryInfo: categoryInfo,
                isRecorded: isRecorded,
                picker: 1,
                addButton: addButton
            }));
        }
    },
    itemAdd_View: async (req, res) => {
        // token 에서 userIdx 파싱
        const userIdx = req.idx;
        const iconInfo = await categoryModel.searchIcon();
        const categoryInfo = await categoryModel.searchInfoAll(userIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_ITEMADD_VIEW_SUCCESS, {
            iconInfo: iconInfo,
            categoryInfo: categoryInfo
        }));
    },
    itemAdd_Save: async (req, res) => {
        const {
            name,
            unit,
            alarmCnt,
            memoCnt,
            iconIdx,
            categoryIdx
        } = req.body;
        if (!name || !unit || !alarmCnt || !memoCnt || !iconIdx || !categoryIdx) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        // item table에 반영
        const result = await itemModel.addItem(name, unit, alarmCnt, memoCnt, iconIdx, categoryIdx);
        // date table에 반영 X 
        var DateFunction = new Date();
        var month = (DateFunction.getMonth() + 1) < 10 ? '0' + (DateFunction.getMonth() + 1) : (DateFunction.getMonth() + 1);
        var day = DateFunction.getDate() < 10 ? '0' + DateFunction.getDate() : DateFunction.getDate();
        var date = DateFunction.getFullYear() + '-' + month + '-' + day;
        // var date="2020-07-18";

        await itemModel.addDate_Item(-1, date, result);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_ITEMADD_DB_SUCCESS}));
    },
    /*searchCategory : async(req,res)=>{
        const categoryInfo = await categoryModel.searchInfoAll();
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.RECORD_SEARCH_CATEGORY_SUCCESS,
            {
                categoryInfo : categoryInfo
            }));
    },*/
    todayRecord_View: async (req, res) => {
        var DateFunction = new Date();
        var month = (DateFunction.getMonth() + 1) < 10 ? '0' + (DateFunction.getMonth() + 1) : (DateFunction.getMonth() + 1);
        var day = DateFunction.getDate() < 10 ? '0' + DateFunction.getDate() : DateFunction.getDate();
        var date = DateFunction.getFullYear() + '.' + month + '.' + day;
        var week = new Array('일', '월', '화', '수', '목', '금', '토');
        var yoil = week[DateFunction.getDay()];
        // date="2020-07-18";
        // userIdx token에서 파싱
        const userIdx = req.idx;
        // 카테고리 정보 조회
        var categoryInfo = await categoryModel.searchInfoAll(userIdx);
        const result = await itemModel.searchInfo_today(userIdx);
        //console.log(result);

        for (var a in result) {
            const iconImg = await itemModel.searchIcon_ItemIdx(result[a].itemIdx);
            result[a].img = iconImg[0].img;
        }
        var itemInfo = result;
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_TODAY_VIEW_SUCCESS, {
            itemInfo: itemInfo,
            categoryInfo: categoryInfo,
            date: date + " " + yoil + "요일"
        }));
    },
    modifyItem: async (req, res) => {
        const itemInfo = req.body.itemInfo;
        const date = req.body.date;
        const userIdx = req.idx;
        //console.log(date); 
        var isRecorded = await itemModel.searchIsRecorded(date);
        for (var a in itemInfo) {
            // item table에 반영
            await itemModel.modifyItem(itemInfo[a].itemIdx, itemInfo[a].presentCnt);
            // date table에 반영
            // 1) 오늘 재고기록을 처음 할 때
            if (isRecorded == 0) {
                await itemModel.addDate_Item(itemInfo[a].presentCnt, date, itemInfo[a].itemIdx);
                await itemModel.resetFlag(userIdx);
            } else {
                // 2) 오늘 재고기록이 처음이 아닐 때 (기록수정)
                await itemModel.modifyDate_Item(itemInfo[a].presentCnt, date, itemInfo[a].itemIdx);
            }
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_MODIFY_ITEM_SUCCESS));
    },
    deleteItem: async (req, res) => {
        const itemIdxList = req.body.itemIdxList;
        var DateFunction = new Date();
        var month = (DateFunction.getMonth() + 1) < 10 ? '0' + (DateFunction.getMonth() + 1) : (DateFunction.getMonth() + 1);
        var day = DateFunction.getDate() < 10 ? '0' + DateFunction.getDate() : DateFunction.getDate();
        var date = DateFunction.getFullYear() + '-' + month + '-' + day;
        //var date = "2020-07-18";
        for (var a in itemIdxList) {
            // item table에 반영
            await itemModel.updateItem(itemIdxList[a]);
            // date table에 반영
            await itemModel.deleteDate_Item(itemIdxList[a], date);
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_DELETE_ITEM_SUCCESS));
    },
    addCategory: async (req, res) => {
        const name = req.body;
        const userIdx = req.idx;
        const result = await categoryModel.addCategory(name, userIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_ADD_CATEGORY_SUCCESS, {
            insertId: result
        }));
    },
    modifyView: async (req, res) => {
        const date = req.params.date;
        // token에서 userIdx 파싱
        const userIdx = req.idx;
        //console.log(date);
        var categoryInfo = await categoryModel.searchInfoAll(userIdx);
        const result = await itemModel.searchModifyView(date);
        for (var a in result) {
            const iconImg = await itemModel.searchIcon_ItemIdx(result[a].itemIdx);
            result[a].img = iconImg[0].img;
        }
        var itemInfo = result;
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_MODIFY_VIEW_SUCCESS, {
            itemInfo: itemInfo,
            categoryInfo: categoryInfo
        }));
    },
    searchCategory_All: async (req, res) => {
        const userIdx = req.idx;
        //var userIdx = 1;
        const result = await categoryModel.searchInfoAll(userIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_SEARCH_CATEGORY_SUCCESS, {
            categoryInfo: result
        }))
    }
}

module.exports = record;
