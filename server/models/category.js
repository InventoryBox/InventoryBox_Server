const pool = require('../modules/pool');
const table_category = 'category';
const table_item = 'item';
const table_icon = 'icon';
const category = {
    searchInfoAll: async (userIdx) => {
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
    },
    searchCategoryCnt : async (userIdx) => {
        const query = `SELECT * FROM ${table_category} WHERE userIdx=${userIdx};`
        try {
            const result = await pool.queryParam(query);
            return result.length;
        } catch (err) {
            console.log('searchCategoryCnt ERROR : ', err);
            throw err;
        }
    },
    deleteCategory : async (categoryIdx) => {
        const query = `DELETE FROM ${table_category} WHERE categoryIdx=${categoryIdx};`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('deleteCategory ERROR : ', err);
            throw err;
        }
    },
    moveCategory : async (itemIdx, categoryIdx) => {
        const query = `UPDATE ${table_item} SET categoryIdx=${categoryIdx} WHERE itemIdx=${itemIdx};`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('moveCategory ERROR : ', err);
            throw err;
        }
    }
}

module.exports = category;