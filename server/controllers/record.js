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
        var date = req.params.date;
        var categoryInfo = await categoryModel.searchInfoAll(userIdx);
        var addButton;
        var picker=1;
        // 오늘 날짜 구하기
        var DateFunction = new Date();
        var month = (DateFunction.getMonth() + 1) < 10 ? '0' + (DateFunction.getMonth() + 1) : (DateFunction.getMonth() + 1);
        var day = DateFunction.getDate() < 10 ? '0' + DateFunction.getDate() : DateFunction.getDate();
        var date_is = DateFunction.getFullYear() + '-' + month + '-' + day;
        // 오늘 재고 기록 여부 확인
        var isRecorded = await itemModel.searchIsRecorded(date_is,userIdx);
        // 요일 구하기
        var week = new Array('일', '월', '화', '수', '목', '금', '토');
        if (!date) {
            res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        } else if (date === '0') {
            // 재고기록 탭 눌렀을 때
            date = date_is;
            picker = 0;
        }
        const result = await itemModel.searchInfo_Date(date,userIdx);
        for (var a in result) { 
            const iconImg = await itemModel.searchIcon_ItemIdx(result[a].itemIdx);
            result[a].img = iconImg[0].img;  
        } 
        var itemInfo = result;
        // addButton 계산
        if (date === date_is) {
            addButton = 1;
        } else {
            addButton = 0;
        }
        // 요일 구하기
        const lastDay = new Date(date);
        var yoil = week[lastDay.getDay()];
        date = replaceAll(date, "-", ".");
        
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_HOME_SUCCESS, {
            itemInfo: itemInfo, 
            categoryInfo: categoryInfo, 
            isRecorded: isRecorded, 
            date: date + " " + yoil + "요일", 
            picker: picker, 
            addButton: addButton
        }));
    },
    itemAdd_View: async (req, res) => {
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
        const userIdx = req.idx;
        if (!name || !unit || !alarmCnt || !memoCnt || !iconIdx || !categoryIdx) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
        // item table에 반영
        const result = await itemModel.addItem(name, unit, alarmCnt, memoCnt, iconIdx, categoryIdx);
        // date table에 반영 
        var DateFunction = new Date();
        var month = (DateFunction.getMonth() + 1) < 10 ? '0' + (DateFunction.getMonth() + 1) : (DateFunction.getMonth() + 1);
        var day = DateFunction.getDate() < 10 ? '0' + DateFunction.getDate() : DateFunction.getDate();
        var date = DateFunction.getFullYear() + '-' + month + '-' + day;

        await itemModel.addDate_Item(-1, date, result, userIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_ITEMADD_DB_SUCCESS));
    },
    /*searchCategory : async(req,res)=>{
        const categoryInfo = await categoryModel.searchInfoAll();
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.RECORD_SEARCH_CATEGORY_SUCCESS,
            {
                categoryInfo : categoryInfo
            }));
    },*/
    todayRecord_View: async (req, res) => {
        // 오늘 날짜 & 요일 구하기
        var DateFunction = new Date();
        var month = (DateFunction.getMonth() + 1) < 10 ? '0' + (DateFunction.getMonth() + 1) : (DateFunction.getMonth() + 1);
        var day = DateFunction.getDate() < 10 ? '0' + DateFunction.getDate() : DateFunction.getDate();
        var date = DateFunction.getFullYear() + '.' + month + '.' + day;
        var week = new Array('일', '월', '화', '수', '목', '금', '토');
        var yoil = week[DateFunction.getDay()];
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

        var isRecorded = await itemModel.searchIsRecorded(date,userIdx);
        for (var a in itemInfo) {
            // item table에 반영
            await itemModel.modifyItem(itemInfo[a].itemIdx, itemInfo[a].presentCnt);
            // date table에 반영
            // 1) 오늘 재고기록을 처음 할 때
            if (isRecorded == 0) {
                await itemModel.addDate_Item(itemInfo[a].presentCnt, date, itemInfo[a].itemIdx,userIdx);
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
        // 오늘 날짜 구하기
        var DateFunction = new Date();
        var month = (DateFunction.getMonth() + 1) < 10 ? '0' + (DateFunction.getMonth() + 1) : (DateFunction.getMonth() + 1);
        var day = DateFunction.getDate() < 10 ? '0' + DateFunction.getDate() : DateFunction.getDate();
        var date = DateFunction.getFullYear() + '-' + month + '-' + day;

        for (var a in itemIdxList) {
            // item table에 반영
            await itemModel.updateItem(itemIdxList[a]);
            // date table에 반영
            await itemModel.deleteDate_Item(itemIdxList[a], date);
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_DELETE_ITEM_SUCCESS));
    },
    addCategory: async (req, res) => {
        const name = req.body.name;
        const userIdx = req.idx;
        // const categoryCnt = await categoryModel.searchCategoryCnt(userIdx);
        const result = await categoryModel.addCategory(name, userIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_ADD_CATEGORY_SUCCESS));
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

        const result = await categoryModel.searchInfoAll(userIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_SEARCH_CATEGORY_SUCCESS, {
            categoryInfo: result
        }));
    },
    deleteCategory : async (req, res) => {
        const {categoryIdx} = req.body;

        const result = await categoryModel.deleteCategory(categoryIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_DELETE_CATEGORY_SUCCESS));
    },
    moveCategory : async (req, res) => {
        const {itemInfo} = req.body;
        for(var a in itemInfo)
        {
            const result = await categoryModel.moveCategory(itemInfo[a].itemIdx,itemInfo[a].categoryIdx);
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.RECORD_MOVE_CATEGORY_SUCCESS))
    }
}

module.exports = record;