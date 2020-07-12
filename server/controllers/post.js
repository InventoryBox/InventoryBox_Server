const itemModel = require('../models/item');
const categoryModel = require('../models/category');
const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const encrypt = require('../modules/encryption');
const jwt = require('../modules/jwt');
const item = require('../models/item');
const {
    return
} = require('../config/database');


const dashboard = {
    potsByDistance: async (req, res) => {
        userIdx = req.idx;

        const postLoc = await postModel.getPostsLoc();
        const postList = await postModel.getPostsInfo();
        const userLoc = await userModel.getUserLoc(userIdx);
        if (postLoc == -1)
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_POSTS));
        if (userLoc == -1)
            return res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_LOC_INFO));

        console.log("postLoc", postLoc, "userloc", userLoc);
        postLoc.sort((a, b) => (getDistance(a.latitude, a.longitude, userLoc[0].latitude, userLoc[0].longitude) > getDistance(b.latitude, b.longitude, userLoc[0].latitude, userLoc[0].longitude)) ? 1 : -1)
        console.log("postLoc", postLoc, "userloc", userLoc);

        const distList = new Array[postLoc.length];
        for (var i = 0; i < postLoc.length; i++) {
            var dist = Math.round(getDistance(a.latitude, a.longitude, userLoc[0].latitude, userLoc[0].longitude) / 100) * 100;
            if (dist > 2000)
                distList.push(dist);
        }

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.POSTS_BY_DISTANCE_SUCCESS, {
            postInfo: postList,
            distance: distList

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