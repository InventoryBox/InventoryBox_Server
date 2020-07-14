const pool = require('../modules/pool');
const user = require('./user');
const table_item = 'item';
const table_icon = 'icon';
const table_date = 'date';
const table_user = 'user';
const table_category = 'category';

const item = {
    // itemIdx에 해당하는 alarmCnt 찾기
    getItemAlarmCnt: async (itemIdx) => {
        const query = `SELECT alarmCnt FROM ${table_item} where itemIdx = ${itemIdx};`;
        try {
            const result = await pool.queryParam(query);
            console.log(result);
            return result;
        } catch (err) {
            throw err;
        }
    },
    // item에서 해당 date의 stocksCnt 찾기
    getStocksInfoOfDay: async (itemIdx, date) => {
        console.log(itemIdx, date);
        const query = `SELECT stocksCnt from ${table_date} natural join ${table_item} WHERE date = "${date}" and itemIdx = ${itemIdx};`;
        try {
            const result = await pool.queryParam(query);
            return (!result.length) ? -1 : result;
        } catch (err) {
            throw err;
        }
    },
    // 해당 itemIdx의 alarmCnt, memoCnt 수정하기
    modifyItemCnt: async (itemIdx, alarmCnt, memoCnt) => {
        const query = `UPDATE ${table_item} SET alarmCnt = ${alarmCnt}, memoCnt = ${memoCnt} WHERE itemIdx = ${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            console.log("modifyItemCnt", result);
            return;
        } catch (err) {
            throw err;
        }
    },

    // date에 해당하는 item들의 정보 출력
    searchInfo_Date: async (date) => {
        const query = `SELECT item.itemIdx,item.name,item.alarmCnt,item.unit,date.stocksCnt,item.categoryIdx
                        FROM ${table_item}, ${table_date} WHERE ${table_item}.itemIdx = ${table_date}.itemIdx and date like '${date}%'`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('searchInfo_Date ERROR : ', err);
            throw err;
        }
    },

    // 해당 date에 기록한 재료(item)의 정보 조회
    searchInfo_today: async (userIdx) => {
        const query = `SELECT item.itemIdx,item.name,item.presentCnt,category.categoryIdx FROM ${table_category} INNER JOIN ${table_item} ON category.categoryIdx = item.categoryIdx
             WHERE category.userIdx = ${userIdx} and item.presentCnt> -2;`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('searchInfo_date_today ERROR : ', err);
            throw err;
        }
    },
    // 해당 date에 기록한 재료(item)의 정보 조회
    getItemsInfoToday: async (userIdx) => {
        const query = `SELECT item.itemIdx,item.name,category.categoryIdx, item.alarmCnt FROM ${table_category} INNER JOIN ${table_item} ON category.categoryIdx = item.categoryIdx
             WHERE category.userIdx = ${userIdx} and item.presentCnt> -2;`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log(' getItemsInfoToday ERROR : ', err);
            throw err;
        }
    },
    // itemIdx에 해당하는 icon img 찾기
    searchIcon_ItemIdx: async (itemIdx) => {
        const query = `SELECT icon.img FROM ${table_icon}, ${table_item}
                        WHERE ${table_icon}.iconIdx = ${table_item}.iconIdx and ${table_item}.itemIdx=${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('searchIcon_ItemIdx ERROR : ', err);
            throw err;
        }
    },
    // DB에 저장된 가장 최근 item의 날짜 조회
    searchLastDate: async () => {
        const query = `SELECT date FROM ${table_date} ORDER BY date DESC`;
        try {
            const result = await pool.queryParam(query);
            return result[0].date;
        } catch (err) {
            console.log('searchLastDate ERROR : ', err);
            throw err;
        }
    },
    // 해당 date에 재고기록을 했는지 여부 조회
    searchIsRecorded: async (date) => {
        const query = `SELECT * FROM ${table_date} WHERE date="${date}"`;
        try {
            const result = await pool.queryParam(query);
            return result.length ? 1 : 0;
        } catch (err) {
            {
                console.log('searchIsRecorded ERROR : ', err);
                throw err;
            }
        }
    },
    // 재료 추가 
    addItem: async (name, unit, alarmCnt, memoCnt, iconIdx, categoryIdx) => {
        const fields = 'name, unit, alarmCnt, memoCnt, presentCnt, iconIdx, categoryIdx';
        const questions = `?, ?, ?, ?, ?, ?, ?`;
        const values = [name, unit, alarmCnt, memoCnt, -1, iconIdx, categoryIdx];
        const query = `INSERT INTO ${table_item}(${fields}) VALUES(${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            console.log('addItem ERROR : ', err);
            throw err;
        }
    },
    searchInfo: async (userIdx) => {
        const query = `SELECT item.itemIdx,item.name,item.alarmCnt,item.presentCnt icon.img
                        FROM ${table_item} NATURAL JOIN ${table_icon} WHERE item.categoryIdx`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            console.log('searchInfo ERROR : ', err);
            throw err;
        }
    },
    // 해당 item의 현재 재고 수정
    modifyItem: async (itemIdx, presentCnt) => {
        const query = `UPDATE ${table_item} SET presentCnt=${presentCnt} WHERE itemIdx=${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            return;
        } catch (err) {
            console.log('modifyItem ERROR : ', err);
            throw err;
        }
    },
    // 해당 재료(item) 삭제
    updateItem: async (itemIdx) => {
        const query = `UPDATE ${table_item} SET presentCnt=-2 WHERE itemIdx=${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            return;
        } catch (err) {
            console.log('updateItem ERROR : ', err);
            throw err;
        }
    },
    // date table에 해당 item 추가 반영
    addDate_Item: async (stocksCnt, date, itemIdx) => {
        const query = `INSERT INTO ${table_date}(stocksCnt, date, itemIdx) VALUES(${stocksCnt},"${date}",${itemIdx});`
        try {
            const result = await pool.queryParam(query);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            console.log('addDate_Item ERROR : ', err);
            throw err;
        }
    },
    // date table에 해당 item 재고량(stocksCnt) 반영
    modifyDate_Item: async (stocksCnt, date, itemIdx) => {
        const query = `UPDATE ${table_date} SET stocksCnt=${stocksCnt} WHERE date = "${date}" and itemIdx=${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            return;
        } catch (err) {
            console.log('modifyDate_Item ERROR : ', err);
            throw err;
        }
    },
    //  date table에서 해당 item 기록 제거
    deleteDate_Item: async (itemIdx, date) => {
        const query = `DELETE FROM ${table_date} WHERE date="${date}" and itemIdx=${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            return;
        } catch (err) {
            console.log('deleteDate_Item ERROR : ', err);
            throw err;
        }
    },

    searchModifyView: async (date) => {
        const query = `SELECT item.itemIdx,item.name,item.categoryIdx,date.stocksCnt
        FROM ${table_item}, ${table_date} WHERE ${table_item}.itemIdx = ${table_date}.itemIdx and date like '${date}%'`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('searchModifyView ERROR : ', err);
        }
    },

    getMemoOrder: async (userIdx, categoryIdx) => {
        const query = `SELECT * FROM ${table_item} JOIN ${table_category} ON item.categoryIdx=category.categoryIdx`
        try {
            const result = await pool.queryParam(query);
            // categoryIdx가 String 값으로 인식돼서, === 로 type 검사를 하면 안된다.
            const resultFilter = result.filter(item => item.userIdx === userIdx).filter(item => item.categoryIdx == categoryIdx).filter(item => item.memoCnt <= item.presentCnt)
            return resultFilter;
        } catch (err) {
            throw err;
        }
    },
    getCategoryInfo: async () => {
        const query = `SELECT categoryIdx,name FROM ${table_category}`
        try {
            const result = await pool.queryParam(query);
            return result
        } catch (err) {
            throw err;
        }

    },
    getItemInfo: async (userIdx) => {
        const query = `
        SELECT 
        item.itemIdx,
        item.flag,
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
        try {
            const result = await pool.queryParam(query);
            // const resultFilter = result.filter(item=>item.userIdx==userIdx) userIdx=1 이므로 그냥 무시
            const resultFilter = result.filter(item => item.memoCnt >= item.presentCnt)
            return resultFilter
        } catch (err) {
            throw err;
        }
    },
    updateOrderMemo: async (itemIdx, memoCnt) => {
        const query = `UPDATE ${table_item} SET memoCnt=${memoCnt} WHERE itemIdx=${itemIdx}`
        try {
            const result = await pool.queryParam(query);
            return result
        } catch (err) {
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
    },
    pushFlag: async (userIdx, itemIdx) => {
        const query = `UPDATE ${table_item} SET flag=1 WHERE itemIdx=${itemIdx}`
        // const query = `UPDATE ${table_item} SET flag=${itemIdx}`

        try {
            const result = await pool.queryParam(query);
            return result
        } catch (err) {
            throw err;
        }
    },
    resetFlag: async (userIdx) => {
        const query = `UPDATE ${table_category} INNER JOIN ${table_item} ON category.categoryIdx = item.categoryIdx
        SET flag=0 WHERE category.userIdx = ${userIdx};`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('resetFlag ERROR : ', err);
            throw err;
        }
    }
}
module.exports = item;