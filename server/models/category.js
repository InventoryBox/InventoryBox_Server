const pool = require('../modules/pool');
const table_category = 'category';
const table_icon = 'icon';
const category = {
   searchInfoAll : async () => {
       const query = `SELECT idx name FROM ${table_category}`;
       try {
        const result = await pool.queryParamArr(query);
        return result;
    } catch (err) {
        console.log('search category Info ERROR : ', err);
        throw err;
    }
    },
    searchIcon : async () =>{
        const query = `SELECT * FROM ${table_icon}`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('searchIcon ERROR : ', err);
            throw err;
        }
    }
}

module.exports = category;