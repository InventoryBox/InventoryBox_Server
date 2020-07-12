const pool = require('../modules/pool');
const table_item = 'item';
const table_icon = 'icon';
const table_date = 'date';
const table_category = 'category';
const table_post = 'post';
const table_user = 'user';
const table_like = 'like';

const post = {

    getPostsInfoByDist: async () => {
        const query = `SELECT latitude, longitude,isFood, price, productName, expDate, uploadDate from ${table_post} natural join ${table_user}`;
        try {
            const result = await pool.queryParam(query);
            return (!result.length) ? -1 : result;
        } catch (err) {
            throw err;
        }
    },

    searchLike: async (userIdx, postIdx) => {
        const query = `SELECT * FROM ${table_like} WHERE userIdx = ${userIdx} and postIdx = ${postIdx}`;
        try {
            const result = await pool.queryParam(query);
            return result.length ? 1 : 0;
        } catch (err) {
            console.log('searchLike ERROR : ', err);
            throw err;
        }
    },

    getPostsInfoByDate: async () => {
        const query = `SELECT latitude, longitude ,isFood, price, productName, expDate, uploadDate from ${table_post} natural join ${table_user} order by uploadDate DESC`;
        try {
            const result = await pool.queryParam(query);
            return (!result.length) ? -1 : result;
        } catch (err) {
            throw err;
        }
    },

    getPostsInfoByPrice: async () => {
        const query = `SELECT latitude, longitude,isFood, price, productName, expDate, uploadDate from ${table_post} natural join ${table_user} order by price ASC`;
        try {
            const result = await pool.queryParam(query);
            return (!result.length) ? -1 : result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = post;