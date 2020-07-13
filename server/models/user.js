const pool = require('../modules/pool');
const table_user = 'user';

const user = {
    userInfo: async (userIdx) => {
        const query = `SELECT repName, coName, location, phoneNumber FROM ${table_user}
                        WHERE userIdx=${userIdx}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('postInfo ERROR : ', err);
            throw err;
        }
    },
    getUserLoc: async (userIdx) => {
        const query = `SELECT latitude, longitude from ${table_user} where userIdx = ${userIdx}`;
        try {
            const result = await pool.queryParam(query);
            return (result.length < 2) ? -1 : result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = user;