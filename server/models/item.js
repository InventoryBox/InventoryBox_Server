const pool = require('../modules/pool');
const table_item = 'item';
const table_icon = 'icon';
const table_date = 'date';
const table_user = 'user';

const item = {
    searchInfo: async (userIdx) => {
        const query = `SELECT item.idx,item.name,item.alarmCnt,item.presentCnt icon.img
                        FROM ${table_item} NATURAL JOIN ${table_icon} WHERE item.categoryIdx`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('signup ERROR : ', err.errno, err.code);
                throw err;
            }
            console.log('searchInfo ERROR : ', err);
            throw err;
        }
    },
    getMemoOrder:async(userIdx,categoryIdx)=>{
        const query = `SELECT * FROM `
    }
}

module.exports = item;