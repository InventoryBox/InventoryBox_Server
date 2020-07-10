const pool = require('../modules/pool');
const table_item = 'item';
const table_icon = 'icon';
const table_date = 'date';

const item = {
    // date에 해당하는 item들의 정보 출력
    searchInfo_Date: async (date) => {
        const query = `SELECT item.idx,item.name,item.alarmCnt,item.presentCnt,item.category_Idx
                    FROM ${table_item}, ${table_date} WHERE ${table_item}.idx = ${table_date}.item_idx and date like '${date}%'`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('searchInfo_Date ERROR : ', err);
            throw err;
        }
    },

    // 해당 date에 기록한 재료(item)의 정보 조회
    searchInfo_date_today: async (date) => {
        const query = `SELECT item.idx,item.name,item.category_idx
        FROM ${table_item}, ${table_date} WHERE ${table_item}.idx = ${table_date}.item_idx and date like '${date}%'`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('searchInfo_date_today ERROR : ', err);
            throw err;
        }
    },

    // itemIdx에 해당하는 icon img 찾기
    searchIcon_ItemIdx: async (itemIdx) => {
        const query = `SELECT icon.img FROM ${table_icon}, ${table_item}
                    WHERE ${table_icon}.idx = ${table_item}.icon_idx and ${table_item}.idx=${itemIdx}`;
        try {
            const result = await pool.queryParamArr(query);
            return result[0];
        } catch (err) {
            console.log('searchIcon_ItemIdx ERROR : ', err);
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

    searchItemInfoToday: async () => {
        const query = `SELECT  icon.img, item.idx, item.name, item.alarmCnt, item.category_Idx FROM ${table_item}, ${table_icon} where item.icon_idx=icon.idx`;

        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('searchInfo_Date ERROR : ', err);
            throw err;
        }
    },

    getStocksInfoOfDay: async (itemIdx, date) => {
        const query = `SELECT stocksCnt from ${table_date} where date="${date}" and item_idx = ${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            return (!result.length) ? -1 : result;
        } catch (err) {
            throw err;
        }
    },

    getItemAlarmCnt: async (itemIdx) => {
        const query = `SELECT item.alarmCnt from ${table_item} where item.idx = ${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            console.log('alarmCnt of item: ', result);
            return result;
        } catch (err) {
            throw err;
        }
    },

    modifyItemCnt: async (itemIdx, alarmCnt, memoCnt) => {
        console.log("/models", alarmCnt, memoCnt);
        const query = `UPDATE ${table_item} SET alarmCnt=${alarmCnt}, memoCnt=${memoCnt} WHERE idx=${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            console.log(result);
            return;
        } catch (err) {
            console.log('modifyItem ERROR : ', err);
            throw err;
        }
    }
}

module.exports = item;