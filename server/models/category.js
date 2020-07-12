const pool = require('../modules/pool');
const table_category = 'category';
const table_icon = 'icon';

const category = {
    searchInfoAll: async () => {
        const query = `SELECT categoryIdx, name FROM ${table_category}`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('searchInfoAll ERROR : ', err);
            throw err;
        }
    }
}

module.exports = category;