const pool = require('../modules/pool');
const table_user = 'user';
const user = {
    updateLoc: async (req, res) => {
        const userIdx = req.idx;
        const {
            address,
            latitude,
            longitude
        } = req.body;
        const result = await userModel.updateLoc(userIdx, address, latitude, longitude);
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ADD_LOC_SUCCESS, {
            insertId: result
        }));
    }
}
module.exports = user;