const pool = require('../modules/pool');
const user = require('./user');
const table_item = 'item';
const table_icon = 'icon';
const table_date = 'date';
const table_category = 'category';

const item = {
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
    // 재고량추이) 오늘 아이템 정보 조회
    searchItemInfoToday: async (userIdx) => {
        const query = `SELECT i.itemIdx, i.name, i.categoryIdx FROM ${table_item} i natural join  ${table_category} c where c.userIdx = ${userIdx} and i.presentCnt > -2`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('searchItemInfoToday ERROR : ', err);
            throw err;
        }
    },
    // itemIdx에 해당하는 icon img 찾기
    searchIcon_ItemIdx: async (itemIdx) => {
        const query = `SELECT icon.img FROM ${table_icon}, ${table_item}
                        WHERE ${table_icon}.iconIdx = ${table_item}.iconIdx and ${table_item}.itemIdx=${itemIdx}`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('searchIcon_ItemIdx ERROR : ', err);
            throw err;
        }
    },
    // itemIdx에 해당하는 icon img 찾기
    searchIconByItemIdx: async (userIdx, itemIdx) => {
        const query = `SELECT icon.img FROM ${table_icon} ic, ${table_item} i, ${table_category} c WHERE ic.iconIdx = i.iconIdx and i.categoryIdx = c.categoryIdx
        and c.userIdx=${userIdx} and i.itemIdx = ${itemIdx}`;
        try {
            const result = await pool.queryParamArr(query);
            return result[0];
        } catch (err) {
            console.log('searchIconByItemIdx ERROR : ', err);
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
    // itemIdx에 해당하는 alarmCnt 찾기
    getItemAlarmCnt: async (userIdx, itemIdx) => {
        const query = `SELECT i.alarmCnt FROM ${table_item} i natural join ${table_category} c where c.userIdx = ${userIdx} and i.itemIdx = ${itemIdx} `;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            throw err;
        }
    },
    // item에서 해당 date의 stocksCnt 찾기
    getStocksInfoOfDay: async (userIdx, itemIdx, date) => {
        const query = `SELECT stocksCnt from ${table_date} d, ${table_item} i, ${table_category} c WHERE  i.categoryIdx = c.categoryIdx and i.itemIdx = d.itemIdx
        and d.date = "${date}" and d.itemIdx = ${itemIdx} and c.userIdx = ${userIdx}`;
        try {
            const result = await pool.queryParam(query);
            return (!result.length) ? -1 : result;
        } catch (err) {
            throw err;
        }
    },
    // 해당 itemIdx의 alarmCnt, memoCnt 수정하기
    modifyItemCnt: async (userIdx, itemIdx, alarmCnt, memoCnt) => {
        const query = `UPDATE ${table_item} natural join SET alarmCnt = ${alarmCnt}, memoCnt = ${memoCnt} WHERE itemIdx = ${itemIdx} and userIdx = ${userIdx}`;
        try {
            const result = await pool.queryParam(query);
            console.log(result);
            return;
        } catch (err) {
            throw err;
        }
    }
}
module.exports = item;