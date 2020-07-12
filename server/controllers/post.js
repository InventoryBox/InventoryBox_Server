const userModel = require('../models/user');
const postModel = require('../models/post');
const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');

const dashboard = {
    potsByDistance: async (req, res) => {
        const userIdx = req.idx;
        const filter = req.params;

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
                    liked: await postModel.searchLike(user, postInfo[i].postIdx),
                    price: postInfo[i].price,
                    distance: dist,
                    productName: postInfo[i].productName,
                    expDate: postInfo[i].expDate,
                    uploadDate: postInfo[i].uploadDate
                })
        }

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.POSTS_HOME_SUCCESS, {
            postInfo: postList
        }));
    }
}

function getDistance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
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
    }

    return Math.round(dist);
}
module.exports = dashboard;