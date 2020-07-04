const mysql = require('promise-mysql');

const config = {
    host : '',
    port : 3306,
    user : '',
    password : '',
    database : ''
}

module.exports = mysql.createPool(config)