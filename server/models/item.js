const pool = require('../modules/pool');
const table_item = 'item';
const table_icon = 'icon';
const table_date = 'date';
const teble_itemDate = 'item-date';

const item = {
    // date에 해당하는 item들의 정보 출력
    searchInfo_Date : async (date) => {
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
    // itemIdx에 해당하는 icon img 찾기
    searchIcon_ItemIdx : async (itemIdx) => {
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
    // DB에 저장된 가장 최근 item의 날짜 조회
    searchLastDate : async () => {
        const query = `SELECT date FROM ${table_date} ORDER BY date DESC`;
        try {
            const result = await pool.queryParam(query);
            return result[0].date; 
        }catch(err)
        {
            console.log('searchLastDate ERROR : ', err);
            throw err;
        }
    },
    // 해당 date에 재고기록을 했는지 여부 조회
    searchIsRecorded : async (date)=>{
        const query = `SELECT * FROM ${table_date} WHERE date="${date}"`;
        try {
            const result = await pool.queryParam(query);
            return result.length? 1 : 0; 
        }catch(err)
        {
            {
                console.log('searchIsRecorded ERROR : ', err);
                throw err;
            }  
        }
    },
    // 재료 추가 
    addItem : async (name, unit, alarmCnt, memoCnt, iconIdx, categoryIdx) =>{
        const fields = 'name, unit, alarmCnt, memoCnt, icon_idx, category_idx';
        const questions = `?, ?, ?, ?, ?, ?`;
        const values = [name, unit, alarmCnt, memoCnt, iconIdx, categoryIdx];
        const query = `INSERT INTO ${table_item}(${fields}) VALUES(${questions})`;
        try {
            const result = await pool.queryParamArr(query,values);
            const insertId = result.insertId;
            return insertId;
        }catch(err)
        {
            console.log('addItem ERROR : ', err);
            throw err;
        }
    },
    // 해당 item의 현재 재고 수정
    modifyItem : async (itemIdx, presentCnt)=>{
        const query = `UPDATE ${table_item} SET presentCnt=${presentCnt} WHERE idx=${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            return ;
        }catch(err)
        {
            console.log('modifyItem ERROR : ', err);
            throw err;
        }
    },
    // 해당 재료(item) 삭제
    updateItem : async (itemIdx) =>{
        const query = `UPDATE ${table_item} SET presentCnt=0 WHERE idx=${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            return ;
        }catch(err)
        {
            console.log('updateItem ERROR : ', err);
            throw err;
        }
    },
    // date table에 해당 item 추가 반영
    addDate_Item : async (stocksCnt,date,itemIdx) => {
        const query = `INSERT INTO ${table_date}(stocksCnt, date, item_idx) VALUES(${stocksCnt},"${date}",${itemIdx});`
        try {
            const result = await pool.queryParam(query);
            const insertId = result.insertId;
            return insertId;
        }catch(err)
        {
            console.log('addDate_Item ERROR : ', err);
            throw err;
        }
    },
    // date table에 해당 item 재고량(stocksCnt) 반영
    modifyDate_Item : async (stocksCnt, date, itemIdx) => {
        const query = `UPDATE ${table_date} SET stocksCnt=${stocksCnt} WHERE date = "${date}" and item_idx=${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            return ;
        }catch(err)
        {
            console.log('modifyDate_Item ERROR : ', err);
            throw err;
        }
    },
    //  date table에서 해당 item 기록 제거
    deleteDate_Item : async (itemIdx,date)=>{
        const query = `DELETE FROM ${table_date} WHERE date="${date}" and item_idx=${itemIdx}`;
        try {
            const result = await pool.queryParam(query);
            return ;
        }catch(err)
        {
            console.log('deleteDate_Item ERROR : ', err);
            throw err;
        }
    },
    // 해당 date에 기록한 재료(item)의 정보 조회
    searchInfo_date_today : async (date)=>{
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
    searchModifyView : async (date) => {
        const query = `SELECT item.idx,item.name,item.category_idx,item.presentCnt
        FROM ${table_item}, ${table_date} WHERE ${table_item}.idx = ${table_date}.item_idx and date like '${date}%'`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('searchModifyView ERROR : ', err);
            throw err;
        }
    }
}
module.exports = item;