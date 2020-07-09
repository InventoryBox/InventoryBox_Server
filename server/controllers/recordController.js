const itemModel = require('../models/item');
const categoryModel = require('../models/category');
const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const encrypt = require('../modules/crypto');
const jwt = require('../modules/jwt');
const item = require('../models/item');
const category = require('../models/category');

const record = {
    home : async (req,res)=>{
        const date = req.params.date;
        var categoryInfo = await categoryModel.SearchInfoAll();
        // params 값 확인
        if( !date )
        {
            res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }else if(date === 0){
           // 재고기록 탭 눌렀을 때
           // 가장 최근 저장된 DB날짜 필요
           const date_send = await itemModel.searchLastDate();
           // 전체 카테고리(0) 값 조회
           const result = await itemModel.searchInfo_date(date_send);
           for(var a in result)
           {
            const iconImg = await itemModel.searchIcon_ItemIdx(result[a].item.idx);
            result[a].img = iconImg.icon.img;   
           }
           var itemInfo = result;
           // isRecorded 정보 조회
           var DateFunction = new Date();
           var date_is = DateFunction.getFullYear()+'-'+DateFunction.getMonth()+'-'+DateFunction.getDate();
           var isRecorded = await itemModel.searchIsRecorded(date_is);
           res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.RECORD_HOME_SUCCESS
              ,{
                  itemInfo : itemInfo,
                  categoryInfo : categoryInfo,
                  isRecorded : isRecorded,
                  date : date_send,
                  picker : 0
              }));
        }else{
            // 데이터 피커 눌렀을 때
            // 해당되는 date에 해당하는 item 조회
            const result = await itemModel.searchInfo_date(date);
            for(var a in result)
            {
             const iconImg = await itemModel.searchIcon_ItemIdx(result[a].item.idx);
             result[a].img = iconImg.icon.img;   
            }
            var itemInfo = result;
            // isRecorded 정보 조회
            var isRecorded = await itemModel.searchIsRecorded(date);
            // pircker = 1
            res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.RECORD_HOME_SUCCESS
            ,{
                itemInfo : itemInfo,
                categoryInfo : categoryInfo,
                isRecorded : isRecorded,
                picker : 1
            }));
        }
    },
    itemAdd_View : async (req,res)=>{
        const iconInfo = await categoryModel.searchIcon();
        const categoryInfo = await categoryModel.searchInfoAll();
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.RECORD_ITEMADD_VIEW_SUCCESS
        ,{
            iconInfo : iconInfo,
            categoryInfo : categoryInfo
        }));
    },
    itemAdd_Save :async (req, res)=>{
        const {
            name,
            unit,
            alarmCnt,
            memoCnt,
            iconIdx,
            categoryIdx
        } = req.body; 
        if(!name || !unit || !alarmCnt || !memoCnt || !iconIdx || !categoryIdx)
        {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST,resMessage.NULL_VALUE));
            return;
        } 
        // item table에 반영
        const result = await itemModel.addItem(name, unit, alarmCnt, memoCnt, iconIdx, categoryIdx);
        // date table에 반영
        // year month week day fullDate 계산 후 반영!!
        // 
        // 
        await itemModel.addDate_Item(year,month,week,day,fullDate,itemInfo[a].itemIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.RECORD_ITEMADD_DB_SUCCESS,
            {
                insertId : result
            }
        ));
    },
    /*searchCategory : async(req,res)=>{
        const categoryInfo = await categoryModel.searchInfoAll();
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.RECORD_SEARCH_CATEGORY_SUCCESS,
            {
                categoryInfo : categoryInfo
            }));
    },*/
    todayRecord_View : async(req,res)=>{
        var date = DateFunction.getFullYear()+'-'+DateFunction.getMonth()+'-'+DateFunction.getDate();
        // 카테고리 정보 조회
        var categoryInfo = await categoryModel.SearchInfoAll();
        // 가장 최근 저장된 날짜를 구해서 item목록 정보 조회
        const date_send = await itemModel.searchLastDate();
        const result = await itemModel.searchInfo_date_today(date_send);
        for(var a in result)
        {
         const iconImg = await itemModel.searchIcon_ItemIdx(result[a].item.idx);
         result[a].img = iconImg.icon.img;   
        }
        var itemInfo = result;
        const result = await itemModel.searchInfo_date_today();
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.RECORD_TODAY_VIEW_SUCCESS,
            {
                itemInfo : itemInfo,
                categoryInfo : categoryInfo,
                date : date
            }));
    },
    modifyItem : async(req,res)=>{
        const itemInfo = req.body.itemInfo;
        const date = req.body.date;
        var isRecorded = await itemModel.searchIsRecorded(date);
        for(var a in itemInfo)
        {
            // item table에 반영
            await itemModel.modifyItem(itemInfo[a].itemIdx,itemInfo[a].presentCnt);
            // date table에 반영
            // 1) 오늘 재고기록을 처음 할 때
            if(isRecorded === 0)
            {
                // year month week day fullDate 계산 후 반영!!
                //
                //
                await itemModel.addDate_Item(year,month,week,day,fullDate,itemInfo[a].itemIdx);
            }else
            {
                // 2) 오늘 재고기록이 처음이 아닐 때 (기록수정)
                await itemModel.modifyDate_Item(itemInfo[a].itemIdx,itemInfo[a].presentCnt);
            }
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.RECORD_MODIFY_ITEM_SUCCESS));
    },
    deleteItem : async(req,res)=>{
        const itemIdxList = req.body.itemIdxList;
        for(var a in itemIdxList)
        {
            // item table에 반영
            await itemModel.modifyItem(itemIdxList[a]);
            // date table에 반영
            await itemModel.deleteDate_Item(itemIdxList[a]);
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.RECORD_DELETE_ITEM_SUCCESS));
    },
    addCategory : async(req,res)=>{

    }
}

module.exports = record;