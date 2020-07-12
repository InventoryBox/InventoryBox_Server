const pool = require('../modules/pool');
const table_item = 'item';
const table_icon = 'icon';
const table_date = 'date';
const table_user = 'user';
const table_category = 'category'

const item = {
    searchInfo: async (userIdx) => {
        const query = `SELECT item.itemIdx,item.name,item.alarmCnt,item.presentCnt icon.img
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
        const query = `SELECT * FROM ${table_item} JOIN ${table_category} ON item.categoryIdx=category.categoryIdx`
        try{
            const result = await pool.queryParam(query);
            // categoryIdx가 String 값으로 인식돼서, === 로 type 검사를 하면 안된다.
            const resultFilter = result.filter(item=>item.userIdx===userIdx).filter(item=>item.categoryIdx==categoryIdx).filter(item=>item.memoCnt<=item.presentCnt)
            return resultFilter;
        }catch(err){
            throw err;
        }
    },
    getCategoryInfo:async()=>{
        const query = `SELECT categoryIdx,name FROM ${table_category}`
        try{
            const result = await pool.queryParam(query);
            return result
        }catch(err){
            throw err;
        }

    },
    getItemInfo:async(userIdx)=>{
        const query = `
        SELECT 
        item.itemIdx,
        item.name AS itemName,
        item.unit,
        item.alarmCnt,
        item.memoCnt,
        item.presentCnt,
        icon.img,
        icon.name AS iconName
        FROM item
        JOIN icon
        ON item.iconIdx=icon.iconIdx
        JOIN category
        ON item.categoryIdx=category.categoryIdx
        ORDER BY itemIdx
        ;
        `
        try{
            const result = await pool.queryParam(query);
            // const resultFilter = result.filter(item=>item.userIdx==userIdx) userIdx=1 이므로 그냥 무시
            const resultFilter = result.filter(item=>item.memoCnt>=item.presentCnt)
            return resultFilter
        }catch(err){
            throw err;
        }
    },
    updateOrderMemo:async(itemIdx,memoCnt)=>{
        const query = `UPDATE ${table_item} SET memoCnt=${memoCnt} WHERE itemIdx=${itemIdx}`
        try{
           const result = await pool.queryParam(query);
           return result
        }catch(err){
            throw err;
        }
    },
    getStocksInfoOfDay: async (itemIdx, date) => {
        const query = `SELECT stocksCnt from ${table_date} where date="${date}" and itemIdx = ${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            return (!result.length) ? -1 : result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = item;