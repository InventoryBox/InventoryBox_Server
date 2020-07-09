const pool = require('../modules/pool');
const table_item = 'item';
const table_icon = 'icon';
const table_date = 'date';
const table_user = 'user';
const table_category = 'category'

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
        const query = `SELECT * FROM ${table_item} JOIN ${table_category} ON item.category_idx=category.idx`
        try{
            const result = await pool.queryParam(query);
            // categoryIdx가 String 값으로 인식돼서, === 로 type 검사를 하면 안된다.
            const resultFilter = result.filter(item=>item.user_idx===userIdx).filter(item=>item.category_idx==categoryIdx).filter(item=>item.memoCnt<=item.presentCnt)
            return resultFilter;
        }catch(err){
            throw err;
        }
    },
    getCategoryInfo:async()=>{
        const query = `SELECT * FROM ${table_category}`
        try{
            const result = await pool.queryParam(query);
            return result
        }catch(err){
            throw err;
        }

    },
    getAllItem:async(userIdx)=>{
        const query = `SELECT * FROM ${table_item} JOIN ${table_category} ON item.category_idx=category.idx`
        try{
            const result = await pool.queryParam(query);
            const resultFilter = result.filter(item=>item.user_idx==userIdx)
            return resultFilter
        }catch(err){
            throw err;
        }
    },
    updateOrderMemo:async(itemIdx,memoCnt)=>{
        const query = `UPDATE ${table_item} SET memoCnt=${memoCnt} WHERE idx=${itemIdx}`
        try{
           const result = await pool.queryParam(query);
           return result
        }catch(err){
            throw err;
        }
    }
}

module.exports = item;