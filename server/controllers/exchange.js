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

const exchange = {
    home: async (req, res) => {
        const userIdx = req.idx;
        const filter = req.params.filter;

        const userLoc = await userModel.getUserLoc(userIdx);
        var postList;

        // 최신순
        if (filter == 0) {
            postList = await postModel.getPostsInfoDist();
            if (postList == -1)
                return res.status(statusCode.BAD_REQUEST)
                    .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_POSTS));
            if (userLoc == -1)
                return res.status(statusCode.BAD_REQUEST)
                    .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_LOC_INFO));

            console.log("DIST before postList", postList, "userLoc", userLoc);
            postList.sort((a, b) => (getDistance(a.latitude, a.longitude, userLoc[0].latitude, userLoc[0].longitude) > getDistance(b.latitude, b.longitude, userLoc[0].latitude, userLoc[0].longitude)) ? 1 : -1)
            console.log("DIST after postList", postList, "userLoc", userLoc);
        }
        // 업로드순
        else if (filter == 1) {
            postList = await postModel.getPostsInfoByDate();
            if (postList == -1)
                return res.status(statusCode.BAD_REQUEST)
                    .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_POSTS));
            console.log("DATE postList", postList);
        }
        // 가격순
        else if (filter == 2) {
            postList = await postModel.getPostsInfoByPrice();
            if (postList == -1)
                return res.status(statusCode.BAD_REQUEST)
                    .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_POSTS));
            console.log("PRICE postList", postList);

        }

        // 2km외인 거 빼고 전달
        var postInfo = new Array[postList.length];
        for (var i = 0; i < postList.length; i++) {
            var dist = Math.round(getDistance(a.latitude, a.longitude, userLoc[0].latitude, userLoc[0].longitude) / 100) * 100;
            if (dist > 2000)
                postInfo.push({
                    isFood: postInfo[i].isFood,
                    postIdx: postInfo[i].postIdx,
                    postImg: postInfo[i].postImg,
                    liked: await postModel.searchLike(user, postInfo[i].postIdx),
                    price: postInfo[i].price,
                    distDiff: dist,
                    productName: postInfo[i].productName,
                    expDate: postInfo[i].expDate,
                    uploadDate: postInfo[i].uploadDate
                })
        }

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.POSTS_HOME_SUCCESS, {
            postInfo: postList
        }));
    },
    postView: async (req, res) => {
        const postIdx = req.params.postIdx;
        var uploadDate = getTimeStamp();
        var userInfo;
        console.log(uploadDate);
        if (!postIdx) {
            res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const itemInfo = await postModel.searchInfo(postIdx);
        if(itemInfo.length != 0 )
        {
             userInfo = await userModel.userInfo(itemInfo[0].userIdx);
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_POST_VIEW_SUCCESS,
            {
                itemInfo: itemInfo,
                userInfo: userInfo
            }));
    },
    searchUserInfo: async (req, res) => {
        // 토큰에서 현재 userIdx 파싱
        // userIdx = [~~~];
        const userIdx = req.idx;
        const userInfo = await userModel.userInfo(userIdx);
        console.log(userInfo);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_USER_INFO_SUCCESS,
            {
                userInfo: userInfo
            })); 
    },
    postSave: async (req, res) => {

        const productImg = req.file.location;
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
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_POST_SAVE_SUCCESS,
            {
                insertIdx: insertIdx
            })); 
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
        const productName = req.params.productName;
        if (!productName) {
            res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        const result = await postModel.searchPartInfo_search(productName);
        // token에서 userIdx 파싱
        const userIdx = req.idx;
        for (var a in result) {
            const likes = await postModel.searchLikes(userIdx, result[a].postIdx);
            result[a].likes = likes;
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_POST_SEARCH_SUCCESS,
            {
                postInfo: result
            }));
        return;
    },
    modifyPost_View: async (req, res) => {
        const postIdx = await req.params.postIdx;
        const itemInfo = await postModel.searchInfo(postIdx);
        const userInfo = await userModel.userInfo(itemInfo[0].userIdx);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_MODIFY_POST_SUCCESS,
            {
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
            tmp[0].likes = 1;
            postInfo.push(tmp[0]);
        }
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.EXCHANGE_SEARCH_USER_LIKE_POST_SUCCESS,
            {
                postInfo: postInfo
            }));
        return;
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
    }
}


module.exports = exchange;