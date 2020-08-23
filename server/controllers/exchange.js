const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const encrypt = require('../modules/encryption');
const jwt = require('../modules/jwt');
const postModel = require('../models/post');
const userModel = require('../models/user');
const s3Storage = require('multer-s3');

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

function dateToKORString(DateFunction) {
    var month = (DateFunction.getMonth() + 1) < 10 ? '0' + (DateFunction.getMonth() + 1) : (DateFunction.getMonth() + 1);
    var date = DateFunction.getDate() < 10 ? '0' + DateFunction.getDate() : DateFunction.getDate();
    return DateFunction.getFullYear() + '년 ' + month + '월 ' + date + '일';
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

function getDistance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2))
        return 0;

    var radLat1 = Math.PI * lat1 / 180;
    var radLat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radTheta = Math.PI * theta / 180;
    var dist = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
    if (dist > 1)
        dist = 1;

    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344 * 1000;
    if (dist < 100) dist = Math.round(dist / 10) * 10;
    else dist = Math.round(dist / 100) * 100;

    return dist;
}

function dateToDotString(DateFunction) {
    var month = (DateFunction.getMonth() + 1) < 10 ? '0' + (DateFunction.getMonth() + 1) : (DateFunction.getMonth() + 1);
    var date = DateFunction.getDate() < 10 ? '0' + DateFunction.getDate() : DateFunction.getDate();
    return DateFunction.getFullYear() + '.' + month + '.' + date;
}
const exchange = {
    // exchange/:filter 
    home: async (req, res) => {
        const userIdx = req.idx;
        const filter = req.params.filter;

        var filterStr;
        switch (parseInt(filter)) {
            case 0:
                filterStr = "uploadDate DESC";
                break;
            case 1:
                filterStr = "postIdx";
                break;
            case 2:
                filterStr = "price ASC";
                break;
        }
        const userLoc = await userModel.getUserLoc(userIdx);
        if (userLoc == -1)
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_LOC_INFO));

        var postList = await postModel.getAllPostsInfo(filterStr);
        if (postList == -1)
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_POSTS));

        var postList_re = [];
        if (filter == 1) postList.sort((a, b) => (getDistance(a.latitude, a.longitude, userLoc[0].latitude, userLoc[0].longitude) > getDistance(b.latitude, b.longitude, userLoc[0].latitude, userLoc[0].longitude)) ? 1 : -1)
        for (var i = 0; i < postList.length; i++) {
            var dist = getDistance(postList[i].latitude, postList[i].longitude, userLoc[0].latitude, userLoc[0].longitude);
            if (dist <= 2000) {
                const likes = await postModel.searchLikes(userIdx, postList[i].postIdx);
                postList[i].distDiff = dist;
                postList[i].uploadDate = dateToKORString(postList[i].uploadDate);
                postList[i].likes = likes;
                postList_re.push(postList[i]);
            }
        }
        //addressInfo 구하기
        var addressInfo = await userModel.getUserByIdx(userIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_HOME_SUCCESS, {
            postInfo: postList_re,
            addressInfo: addressInfo[0].location
        }));
    },
    updateLoc: async (req, res) => {
        const userIdx = req.idx;
        const {
            address,
            latitude,
            longitude
        } = req.body;
        const result = await userModel.updateLoc(userIdx, address, latitude, longitude);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ADD_LOC_SUCCESS));
    },
    postView: async (req, res) => {
        const postIdx = req.params.postIdx;
        var userInfo;
        const userIdx = req.idx;
        if (!postIdx) {
            res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        if (!await postModel.checkPost(postIdx)) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.OK, resMessage.EXCHANGE_POST_NULL));
        }
        const itemInfo = await postModel.searchInfo(postIdx);
        if (itemInfo.length != 0) {
            userInfo = await userModel.userInfo(itemInfo[0].userIdx);
        }
        const uploadDate = dateToDotString(itemInfo[0].uploadDate);
        itemInfo[0].uploadDate = uploadDate;

        // 거리 계산
        const userLoc = await userModel.getUserLoc(req.idx);
        var user = await userModel.getUserByIdx(itemInfo[0].userIdx);
        var dist = getDistance(user[0].latitude, user[0].longitude, userLoc[0].latitude, userLoc[0].longitude);
        itemInfo[0].distDiff = dist;
        // userCheck (판매자인지 사용자인지 여부)
        const userCheck = await postModel.checkUser(postIdx,userIdx);
        itemInfo[0].userCheck = userCheck.length;
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_POST_VIEW_SUCCESS, {
            itemInfo: itemInfo[0],
            userInfo: userInfo[0]
        }));
    },
    searchUserInfo: async (req, res) => {
        // 토큰에서 현재 userIdx 파싱
        // userIdx = [~~~];
        const userIdx = req.idx;
        const userInfo = await userModel.userInfo(userIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_USER_INFO_SUCCESS, {
            userInfo: userInfo[0]
        }));

    },
    postSave: async (req, res) => {
        const productImg = req.file.location;
        //const productImg = "http://~";
        const {
            productName,
            isFood,
            price,
            quantity,
            expDate, // 공산품이면 expDate null 값임
            description,
            coverPrice,
            unit
        } = req.body;
        if (!productName || !isFood || !price || !productImg || !quantity || !description || !coverPrice || !unit) {
            res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        var uploadDate = getTimeStamp();
        // token에서 userIdx 파싱
        const userIdx = req.idx;
        const insertIdx = await postModel.postSave(productImg, productName, quantity, isFood, price, description, expDate, uploadDate, 0, coverPrice, unit, userIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_POST_SAVE_SUCCESS));
    },
    modifyIsSold: async (req, res) => {
        const postIdx = req.body.postIdx;
        const isSold = await postModel.getIsSold(postIdx);
        const result = await postModel.modifyIsSold(postIdx, isSold);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_MODIFY_ISSOLD_SUCCESS));
        return;
    },
    modifyLikes: async (req, res) => {
        const postIdx = req.body.postIdx;
        // userIdx = [~~~]
        // 해당 user가 post를 like 하는지 여부 조회
        const userIdx = req.idx;
        const likes = await postModel.searchLikes(userIdx, postIdx);
        if (likes == 1) {
            // like table에서 row 삭제
            const result = await postModel.deleteLikes(userIdx, postIdx);
        } else {
            // like table에 row 추가
            const result = await postModel.addLikes(userIdx, postIdx);
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_MODIFY_LIKE_SUCCESS));
        return;
    },
    searchPost: async (req, res) => {
        const userIdx = req.idx;
        const keyword = req.params.keyword;
        const filter = req.params.filter;
        if (!keyword) {
            res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        var filterStr;
        switch (parseInt(filter)) {
            case 0:
                filterStr = "uploadDate DESC";
                break;
            case 1:
                filterStr = "postIdx";
                break;
            case 2:
                filterStr = "price ASC";
                break;
        }

        const userLoc = await userModel.getUserLoc(userIdx);
        if (userLoc == -1)
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_LOC_INFO));

        var postList = await postModel.searchPartInfo_search(keyword, filterStr);
        if (postList == -1)
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_POSTS));

        if (filter == 1) postList.sort((a, b) => (getDistance(a.latitude, a.longitude, userLoc[0].latitude, userLoc[0].longitude) > getDistance(b.latitude, b.longitude, userLoc[0].latitude, userLoc[0].longitude)) ? 1 : -1)
        for (var i = 0; i < postList.length; i++) {
            var dist = getDistance(postList[i].latitude, postList[i].longitude, userLoc[0].latitude, userLoc[0].longitude);
            // console.log(postList[i], dist);
            if (dist <= 2000) {
                const likes = await postModel.searchLikes(userIdx, postList[i].postIdx);
                postList[i].distDiff = dist;
                postList[i].uploadDate = dateToKORString(postList[i].uploadDate);
                postList[i].likes = likes;
            }
        }
        //addressInfo 구하기
        var addressInfo = await userModel.getUserByIdx(userIdx);
        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_POST_SEARCH_SUCCESS, {
            postInfo: postList,
            addressInfo: addressInfo[0].location
        }));
    },
    modifyPost_View: async (req, res) => {
        const postIdx = await req.params.postIdx;
        const itemInfo = await postModel.searchInfo(postIdx);
        const userInfo = await userModel.userInfo(itemInfo[0].userIdx);
        const uploadDate = dateToKORString(itemInfo[0].uploadDate);
        itemInfo[0].uploadDate = uploadDate;
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_MODIFY_POST_SUCCESS, {
            itemInfo: itemInfo,
            userInfo: userInfo
        }));
        return;
    },
    searchUserLikes: async (req, res) => {
        // token 에서 userIdx 파싱
        const userIdx = req.idx;
        const result = await postModel.searchUserLikes(userIdx);
        var postInfo = [];
        for (var a in result) {
            const tmp = await postModel.searchInfo_Part(result[a].postIdx);
            const uploadDate = dateToKORString(tmp[0].uploadDate);
            tmp[0].uploadDate = uploadDate;
            tmp[0].likes = 1;
            postInfo.push(tmp[0]);
        }
        console.log(postInfo);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_SEARCH_USER_LIKE_POST_SUCCESS, {
            postInfo: postInfo
        }));
    },
    modifyPost: async (req, res) => {
        const productImg = req.file.location;
        const {
            postIdx,
            productName,
            isFood,
            price,
            quantity,
            expDate, // 공산품이면 expDate null 값임
            description,
            coverPrice,
            unit
        } = req.body;
        // postIdx에 해당하는 현재 이미지 값과 새로받은 이미지가 다르면 기존거 삭제!
        /*var productImg_before = await postModel.SearchPost(PostIdx);
        if(productImg != productImg_before){
        }*/
        if (!productName || !isFood || !price || !productImg || !quantity || !description || !coverPrice || !unit) {
            res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const result = await postModel.modifyPost(postIdx, productImg, productName, quantity, isFood, price, description, expDate,
            coverPrice, unit);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_POST_MODIFY_SUCCESS));
        return;
    },
    searchUserPost : async (req,res) => {
        const userIdx = req.idx;
        const result = await postModel.searchUserPost(userIdx);
        for(var a in result)
        {
            result[a].uploadDate = dateToDotString(result[a].uploadDate).slice(2);
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK,resMessage.EXCHANGE_SEARCH_USER_POST_SUCCESS,{
            itemInfo : result
        }));
    }
}

module.exports = exchange;