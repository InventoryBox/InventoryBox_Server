const pool = require('../modules/pool');
const table_item = 'item';
const table_icon = 'icon';
const table_date = 'date';
const table_category = 'category';

const item = {
    // 해당 date에 기록한 재료(item)의 정보 조회
    searchItemInfoToday: async (userIdx) => {
        const query = `SELECT i.itemIdx, i.name, i.categoryIdx FROM ${table_item} i natural join  ${table_category} c where c.userIdx = ${userIdx} `;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('searchInfo_date_today ERROR : ', err);
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
            console.log('searchIcon_ItemIdx ERROR : ', err);
            throw err;
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