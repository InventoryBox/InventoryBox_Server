const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const encrypt = require('../modules/encryption');
const jwt = require('../modules/jwt');

const user = {
    updateLocation: async (req, res) => {
        const userIdx = req.idx;
        const {
            address,
            latitude,
            longitude
        } = req.body;
        const result = await categoryModel.updateLocation(userIdx, address, latitude, longitude);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ADD_LOC_SUCCESS, {
            insertId: result
        }));
    }
}

module.exports = user;