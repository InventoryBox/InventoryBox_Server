const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const encrypt = require('../modules/encryption');
const jwt = require('../modules/jwt');
const postModel = require('../models/post');
const userModel = require('../models/user');

function getTimeStamp() {
    var d = new Date();
  
    var s =
      leadingZeros(d.getFullYear(), 4) + '-' +
      leadingZeros(d.getMonth() + 1, 2) + '-' +
      leadingZeros(d.getDate(), 2) + ' ' +
  
      leadingZeros(d.getHours(), 2) + ':' +
      leadingZeros(d.getMinutes(), 2) + ':' +
      leadingZeros(d.getSeconds(), 2);
  
    return s;
  }

  function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();
  
    if (n.length < digits) {
      for (i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
  }
const exchange = {
    home : async (req,res)=>{
        const category = req.params.category;
        if( !category )
        {
            res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        if(category == 0)
        {
            // post정보 불러오기 (searchPartInfo_All)
            const result = await postModel.searchPartInfo_All();
            // token에서 userIdx 파싱
            var userIdx = 1;
            for(var a in result)
            {
                const likes = await postModel.searchLikes(userIdx,result[a].postIdx);
                result[a].likes = likes;
            }
            // distDiff, timeDiff 계산?
        }else if(category == 1)
        {

        }else
        {

        }
    },
    postView : async (req,res)=>{
        const postIdx = req.params.postIdx;
        var uploadDate = getTimeStamp();
        console.log(uploadDate);
        if( !postIdx )
        {
            res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const itemInfo = await postModel.searchInfo(postIdx);
        const userInfo = await userModel.userInfo(itemInfo[0].userIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.EXCHANGE_POST_VIEW_SUCCESS,
            {
                itemInfo : itemInfo,
                userInfo : userInfo
            }));
    },
    searchUserInfo : async (req,res) =>{
        // 토큰에서 현재 userIdx 파싱
        // userIdx = [~~~];
        var userIdx =1;
        const userInfo = await userModel.userInfo(userIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.EXCHANGE_USER_INFO_SUCCESS,
            {
                userInfo : userInfo
            }));
    },
    postSave : async (req,res) => {
        const {
            productName,
            isFood,
            price,
            productImg,
            quantity,
            expDate, // 공산품이면 expDate null 값임
            description,
            coverPrice,
            unit
        } = req.body;
        if( !productName || ! isFood || !price || !productImg || !quantity || !description || !coverPrice || !unit)
        {
            res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        var uploadDate = getTimeStamp();
        // token에서 userIdx 파싱
        var userIdx = 1;
        const insertIdx = await postModel.postSave(productImg,productName,quantity,isFood,price,description,expDate,uploadDate,0,coverPrice,unit,userIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.EXCHANGE_POST_SAVE_SUCCESS,
            {
                insertIdx : insertIdx
            })); 
    },
    modifyIsSold : async (req,res) => {
        const postIdx = req.body.postIdx;
        const isSold = await postModel.getIsSold(postIdx);
        const result = await postModel.modifyIsSold(postIdx,isSold);
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.EXCHANGE_MODIFY_ISSOLD_SUCCESS));
        return ;
    },
    modifyLikes : async (req,res) => {
        const postIdx = req.body.postIdx;
        // userIdx = [~~~]
        // 해당 user가 post를 like 하는지 여부 조회
        var userIdx = 1; 
        const likes = await postModel.searchLikes(userIdx,postIdx);
        if(likes == 1)
        {
            // like table에서 row 삭제
            const result = await postModel.deleteLikes(userIdx,postIdx);
        }else
        {
            // like table에 row 추가
            const result = await postModel.addLikes(userIdx,postIdx);
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.EXCHANGE_MODIFY_LIKE_SUCCESS));
        return ; 
    },
    searchPost : async(req,res) => {
        const productName = req.params.productName;
        if( !productName )
        {
            res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const result = await postModel.searchPartInfo_search(productName);
        // token에서 userIdx 파싱
        var userIdx = 1;
        for(var a in result)
        {
            const likes = await postModel.searchLikes(userIdx,result[a].postIdx);
            result[a].likes = likes;
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.EXCHANGE_POST_SEARCH_SUCCESS,
            {
                postInfo : result
            }));
        return ;
    },
    modifyPost_View : async (req,res) =>{
        const postIdx = await req.params.postIdx;
        const itemInfo = await postModel.searchInfo(postIdx);
        const userInfo = await userModel.userInfo(itemInfo[0].userIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.EXCHANGE_MODIFY_POST_SUCCESS,
            {
                itemInfo : itemInfo,
                userInfo : userInfo
            }));
            return ; 
    },
    searchUserLikes : async (req,res) => {
        // token 에서 userIdx 파싱
        var userIdx = 1;
        const result = await postModel.searchUserLikes(userIdx);
        var postInfo=[];
        for(var a in result)
        {
            const tmp = await postModel.searchInfo_Part(result[a].postIdx);
            tmp[0].likes = 1;
            postInfo.push(tmp[0]);
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_SEARCH_USER_LIKE_POST_SUCCESS,
            {
                postInfo : postInfo
            }));
        return;
    },
    modifyPost : async (req,res) => {
        const {
            postIdx,
            productName,
            isFood,
            price,
            productImg,
            quantity,
            expDate, // 공산품이면 expDate null 값임
            description,
            coverPrice,
            unit
        } = req.body;
        if( !productName || ! isFood || !price || !productImg || !quantity || !description || !coverPrice || !unit)
        {
            res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const result = await postModel.modifyPost(postIdx,productImg,productName,quantity,isFood,price,description,expDate,
            coverPrice,unit);
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.EXCHANGE_POST_MODIFY_SUCCESS));
        return ; 
    }
}
module.exports = exchange;