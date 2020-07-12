const pool = require('../modules/pool');
const post = {
    getPostsLoc: async () => {
        const query = `SELECT latitude, longitude from ${table_post}, ${table_user} where user.idx = post.user_idx`;
        try {
            const result = await pool.queryParam(query);
            return (!result.length) ? -1 : result;
        } catch (err) {
            throw err;
        }
    },

    getPostsInfo: async () => {
        const query = `SELECT isFood, price, productName, expDate, uploadDate from ${table_post}, ${table_user} where user.idx = post.user_idx and user.idx = ${user_idx}`;
        try {
            const result = await pool.queryParam(query);
            return (!result.length) ? -1 : result;
        } catch (err) {
            throw err;
        }
    },

    getPostsInfoByDate: async () => {
        const query = `SELECT isFood, price, productName, expDate, uploadDate from ${table_post}, ${table_user} where user.idx = post.user_idx and user.idx = ${user_idx} order by uploadDate DESC`;
        try {
            const result = await pool.queryParam(query);
            return (!result.length) ? -1 : result;
        } catch (err) {
            throw err;
        }
    },

    getPostsInfoByPrice: async () => {
        const query = `SELECT isFood, price, productName, expDate, uploadDate from ${table_post}, ${table_user} where user.idx = post.user_idx and user.idx = ${user_idx} order by price ASC`;
        try {
            const result = await pool.queryParam(query);
            return (!result.length) ? -1 : result;
        } catch (err) {
            throw err;
        }
    },

}

module.exports = post;