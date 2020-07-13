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
        }
}

module.exports = user;