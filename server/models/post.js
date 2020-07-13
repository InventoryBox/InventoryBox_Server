const pool = require('../modules/pool');
const table_post = 'post';
const table_likes = 'likes';
const table_user = 'user';

const post = {

    // 부분적인 정보 필요 (home 화면)
    searchPartInfo_All: async () => {
        const query = `SELECT postIdx,productImg,productName,price,expDate,isSold,uploadDate
         FROM ${table_post}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('searchPartInfo_All ERROR : ', err);
            throw err;
        }
    },


    getPostsInfoByDist: async () => {
        const query = `SELECT postIdx,postImg, latitude, longitude,isFood, price, productName, expDate, uploadDate from ${table_post} natural join ${table_user}`;
        try {
            const result = await pool.queryParam(query);
            return (!result.length) ? -1 : result;
        } catch (err) {
            throw err;
        }
    },

    searchLike: async (userIdx, postIdx) => {
        const query = `SELECT * FROM ${table_likes} WHERE userIdx = ${userIdx} and postIdx = ${postIdx}`;
        try {
            const result = await pool.queryParam(query);
            return result.length ? 1 : 0;
        } catch (err) {
            console.log('searchLikes ERROR : ', err);
            throw err;
        }
    },
    // 특정 게시글 모든 정보 조회 
    searchInfo: async (postIdx) => {
        const query = `SELECT postIdx,productImg,productName,quantity,isFood,price,description,expDate,date_format(uploadDate,'%Y-%m-%d %h:%i:%s') AS date,isSold,coverPrice,unit,userIdx FROM ${table_post} WHERE postIdx=${postIdx}`;
        try {
            const result = await pool.queryParam(query);
            console.log(result);
            return result;
        } catch (err) {
            console.log('searchInfo ERROR : ', err);
            throw err;
        }
    },
    postSave: async (productImg, productName, quantity, isFood, price, description, expDate,
        uploadDate, isSold, coverPrice, unit, userIdx) => {
        const fields = 'productImg,productName,quantity,isFood,price,description,expDate,uploadDate,isSold,coverPrice,unit,userIdx';
        const questions = '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?';
        const values = [productImg, productName, quantity, isFood, price, description, expDate,
            uploadDate, isSold, coverPrice, unit, userIdx];
        const query = `INSERT INTO ${table_post}(${fields}) VALUES(${questions});`
        try {
            const result = await pool.queryParamArr(query, values);
            return result.insertId;
        } catch (err) {
            console.log('postSave ERROR : ', err);
            throw err;
        }
    },
    modifyIsSold: async (postIdx, isSold) => {
        const query = `UPDATE ${table_post} SET isSold=1-${isSold} WHERE postIdx=${postIdx}`;
        try {
            const result = await pool.queryParam(query);
            return;
        } catch (err) {
            console.log('modifyIsSold ERROR : ', err);
            throw err;
        }
    },
    getIsSold: async (postIdx) => {
        const query = `SELECT isSold FROM ${table_post} WHERE postIdx=${postIdx}`;
        try {
            const result = await pool.queryParam(query);
            return result[0].isSold;
        } catch (err) {
            console.log('getIsSold ERROR : ', err);
            throw err;
        }
    },
    deleteLikes: async (userIdx, postIdx) => {
        const query = `DELETE FROM ${table_likes} WHERE postIdx=${postIdx} and userIdx=${userIdx}`;
        try {
            const result = await pool.queryParam(query);
            return;
        } catch (err) {
            console.log('deletelikes ERROR : ', err);
            throw err;
        }
    },
    addLikes: async (userIdx, postIdx) => {
        const query = `INSERT INTO ${table_likes}(userIdx, postIdx) VALUES(${userIdx}, ${postIdx})`;
        try {
            const result = await pool.queryParam(query);
            return;
        } catch (err) {
            console.log('addlikes ERROR : ', err);
            throw err;
        }
    },
    searchPartInfo_search: async (productName) => {
        const query = `SELECT postIdx,productImg,productName,price,expDate,isSold,uploadDate
         FROM ${table_post} WHERE productName like "%${productName}%"`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('searchPartInfo_search ERROR : ', err);
            throw err;
        }
    },
    searchUserLikes: async (userIdx) => {
        const query = `SELECT postIdx FROM ${table_likes} WHERE userIdx=${userIdx}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('searchUserLikes ERROR : ', err);
            throw err;
        }
    },
    searchInfo_Part: async (postIdx) => {
        const query = `SELECT postIdx,productImg,productName,price,expDate,isSold,uploadDate
        FROM ${table_post} WHERE postIdx = ${postIdx}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('searchInfo_Part ERROR : ', err);
            throw err;
        }
    },
    modifyPost: async (postIdx, productImg, productName, quantity, isFood, price, description, expDate,
        coverPrice, unit) => {
        const query = `UPDATE ${table_post} SET productImg="${productImg}",productName="${productName}",quantity=${quantity},
                isFood=${isFood},price=${price},description="${description}",expDate="${expDate}",
                coverPrice=${coverPrice},unit="${unit}" WHERE postIdx=${postIdx}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('modifyPost ERROR : ', err);
            throw err;
        }
    },

    getPostsInfoByDate: async () => {
        const query = `SELECT  postIdx,postImg,latitude, longitude ,isFood, price, productName, expDate, uploadDate from ${table_post} natural join ${table_user} order by uploadDate DESC`;
        try {
            const result = await pool.queryParam(query);
            return (!result.length) ? -1 : result;
        } catch (err) {
            throw err;
        }
    },

    getPostsInfoByPrice: async () => {
        const query = `SELECT  postIdx,postImg,latitude, longitude,isFood, price, productName, expDate, uploadDate from ${table_post} natural join ${table_user} order by price ASC`;
        try {
            const result = await pool.queryParam(query);
            return (!result.length) ? -1 : result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = post;