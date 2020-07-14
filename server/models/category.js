const pool = require('../modules/pool');
const table_category = 'category';
const table_icon = 'icon';
const category = {
    searchInfoAll: async (userIdx) => {
        console.log("searchInfoAll", userIdx);
        const query = `SELECT categoryIdx, name FROM ${table_category} WHERE userIdx=${userIdx};`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('searchInfoAll ERROR : ', err);
            throw err;
        }
    },
    searchIcon: async () => {
        const query = `SELECT * FROM ${table_icon};`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('searchIcon ERROR : ', err);
            throw err;
        }
    },
    addCategory: async (name, userIdx) => {
        const query = `INSERT INTO ${table_category}(name, userIdx) VALUES ("${name}",${userIdx});`
        try {
            const result = await pool.queryParam(query);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            console.log('addCategory ERROR : ', err);
            throw err;
        }
    }
}

module.exports = category;