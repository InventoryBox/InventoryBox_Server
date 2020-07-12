const pool = require('../modules/pool');
const table_user = 'user';

const user = {
        updateLocation: async (userIdx, address, latitude, longitude) => {
            const fields = 'address, latitude, longitude';
            const questions = `?, ?, ?, ?, ?, ?`;
            const values = [address, latitude, longitude];
            const query = `INSERT INTO ${table_user}(${fields}) VALUES(${questions}) where userIdx = ${userIdx}`;
            try {
                const result = await pool.queryParamArr(query, values);
                const insertId = result.insertId;
                return insertId;
            } catch (err) {
                console.log('addLocInfo ERROR : ', err);
                throw err;
            }
        },
        getUserLoc: async (userIdx) => {
                const query = `SELECT latitude, longitude from ${table_user} where userIdx = ${userIdx}';
        try {
            const result = await pool.queryParam(query);
            return (result.length < 2) ? -1 : result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = user;