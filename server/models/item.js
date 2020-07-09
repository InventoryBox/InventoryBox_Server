const pool = require('../modules/pool');
const table_item = 'item';
const table_icon = 'icon';
const table_date = 'date';
const teble_itemDate = 'item-date';

const item = {
    // date에 해당하는 item들의 정보 출력
    searchInfo_Date : async (date) => {
        const query = `SELECT item.idx,item.name,item.alarmCnt,item.presentCnt,item.category_Idx
                        FROM ${table_item} NATURAL JOIN ${table_date} WHERE fullDate = ${date}`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('searchInfoAll ERROR : ', err);
            throw err;
        }
    },
    // itemIdx에 해당하는 icon img 찾기
    searchIcon_ItemIdx : async (itemIdx) => {
        const query = `SELECT icon.img FROM ${table_icon} NATURAL JOIN ${table_item}
                        WHERE item.idx=${itemIdx}`;
        try {
            const result = await pool.queryParamArr(query);
            return result[0];
        } catch (err) {
            console.log('searchInfoAll ERROR : ', err);
            throw err;
        }
    },
    // DB에 저장된 가장 최근 item의 날짜 조회
    searchLastDate : async () => {
        const query = `SELECT * FROM ${table_date} ORDER BY fullDate DESC`;
        try {
            const result = await pool.queryParam(query);
            return result[0].date; 
        }catch(err)
        {
            throw err;
        }
    },
    searchIsRecorded : async (date)=>{
        const query = `SELECT * FROM ${table_date} WHERE fullDate=${date}`;
        try {
            const result = await pool.queryParam(query);
            return result.length()? 1 : 0; 
        }catch(err)
        {
            throw err;
        }
    },
    // 재료 추가 
    addItem : async (name, unit, alarmCnt, memoCnt, iconIdx, categoryIdx) =>{
        const fields = 'name, unit, alarmCnt, memoCnt, presentCnt, icon_idx';
        const questions = `?, ?, ?, ?, ?, ?`;
        const values = [name, unit, alarmCnt, memoCnt, iconIdx, categoryIdx];
        const query = `INSERT INTO ${table_item}(${fields}) VALUES(${questions})`;
        try {
            const result = await pool.queryParamArr(query,values);
            const insertId = result.insertId;
            return insertId;
        }catch(err)
        {
            throw err;
        }
    },
    modifyItem : async (itemIdx, presentCnt)=>{
        const query = `UPDATE ${table_item} SET presentCnt=${presentCnt} WHERE idx=${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            return ;
        }catch(err)
        {
            throw err;
        }
    },
    deleteItem : async (itemIdx) =>{
        const query = `DELETE FROM ${table_item} WHERE idx=${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            return ;
        }catch(err)
        {
            throw err;
        }
    },
    addDate_Item : async (year,month,week,day,fullDate,itemIdx) => {
        // item에 대한 년,월,일,주, 전체날짜, itemIdx값 계산 후 삽입
    },
    modifyDate_Item : async (itemIdx,presentCnt) => {
        const query = `UPDATE ${table_date} SET stocksCnt=${presentCnt} WHERE item_idx=${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            return ;
        }catch(err)
        {
            throw err;
        }
    },
    deleteDate_Item : async (itemIdx)=>{
        const query = `DELETE FROM ${table_date} WHERE item_idx=${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            return ;
        }catch(err)
        {
            throw err;
        }
    },
    searchInfo_date_today : async (date)=>{
        const query = `SELECT item.idx,item.name
        FROM ${table_item} NATURAL JOIN ${table_date} WHERE fullDate = ${date}`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('searchInfoAll ERROR : ', err);
            throw err;
        }
        
    }
    
}
module.exports = item;