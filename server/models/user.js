const pool = require('../modules/pool');
const table = 'user';
const crypto = require('crypto');
const { value } = require('../config/database');
const { SALT_PASSWORD_SUCCESS } = require('../modules/responseMessage');
const table_user = 'user';
const table_post = 'post';
const table_category = 'category'


const user = {
    userInfo: async (userIdx) => {
        const query = `SELECT repName,coName,location,phoneNumber FROM ${table_user}
                        WHERE userIdx=${userIdx}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('userInfo ERROR : ', err);
            throw err;
        }
    },
    getUserLoc: async (userIdx) => {
        const query = `SELECT latitude, longitude from ${table_user} where userIdx = ${userIdx}`;
        try {
            const result = await pool.queryParam(query);
            return (result.length < 0) ? -1 : result;
        } catch (err) {
            throw err;
        }
    },
    updateLoc: async (userIdx, address, latitude, longitude) => {
        const query = `UPDATE ${table_user} SET location = "${address}", latitude = ${latitude}, longitude = ${longitude} where userIdx = ${userIdx}`;
        try {
            const result = await pool.queryParam(query);
            return;
        } catch (err) {
            throw err;
        }
    },
    signup: async (email, password, salt, nickname, repName, coName, phoneNumber,pushAlarm,img) => {
        const fields = 'email,password,salt,nickname,repName,coName,phoneNumber,pushAlarm,img'
        const values = [email, password, salt, nickname, repName, coName, phoneNumber,pushAlarm,img]

        const query = `INSERT INTO ${table}(${fields}) VALUES(?,?,?,?,?,?,?,?,?)`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertIdx = result.insertId;
            const queryCategory = `INSERT INTO ${table_category}(userIdx,name) VALUES(${insertIdx},"전체")`
            const categoryResult = await pool.queryParam(queryCategory)
            return insertIdx;
        } catch (err) {
            throw err
        }
    },
    signin: async (email, password) => {
        const query = `SELECT * FROM ${table} WHERE email="${email}"`
        try {

            const userData = await pool.queryParam(query);

            const hashedPw = crypto.pbkdf2Sync(password, userData[0].salt, 1, 32, 'sha512').toString('hex')
        
            if (userData[0].password === hashedPw) {
                return true
            } else {
                return false
            }
        } catch (error) {
            throw error
        }
    },
    findEmail: async (repName, coName, phoneNumber) => {
        const query = `SELECT * FROM ${table_user} WHERE repName="${repName}" AND coName="${coName}" AND phoneNumber="${phoneNumber}"`
        try {
            const findEmail = await pool.queryParam(query)
            return findEmail
        } catch (err) {
            throw err
        }
    },
    getUserByEmail: async (email) => {
        const query = `SELECT * FROM ${table} WHERE email="${email}"`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (error) {
            throw error
        }
    },

    // -password -salt
    getUserByIdx: async (idx) => {
        const query = `SELECT * FROM ${table} WHERE userIdx="${idx}"`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (error) {
            throw error
        }
    },

    deleteUser: async (idx) => {
        const query = `DELETE FROM user WHERE userIdx=${idx}`
        try {
            const result = await pool.queryParam(query);
            return result.protocol41;
        } catch (error) {
            throw error
        }
    },
    checkUser: async (email) => {
        const query = `SELECT * FROM ${table} WHERE email="${email}"`;
        try {
            const result = await pool.queryParam(query);
            if (result.length === 0) {
                return false;
            } else return true;
        } catch (error) {
            if (error.errno = 1062) {
                console.log('checkUser ERROR :', err.errno, err.code);
                return -1;
            }
            console.log('checkUser :', error)
        }
    },
    checkUserByEmail: async (email) => {
        const query = `SELECT * FROM ${table} WHERE email="${email}"`;
        try {
            const result = await pool.queryParam(query);
            if (result.length > 0) {
                return false;
            } else{
                return true;
            } 
        } catch (error) {
            if (error.errno = 1062) {
                console.log('checkUser ERROR :', err.errno, err.code);
                return -1;
            }
            console.log('checkUser :', error)
        }
    },
    checkNickname: async (nickname) => {
        const query = `SELECT * FROM ${table_user} WHERE nickname="${nickname}"`;
        try {
            const result = await pool.queryParam(query);
            if (result.length === 0) {
                return true;
            } else return false;
        } catch (error) {
            if (error.errno = 1062) {
                console.log('checkUser ERROR :', err.errno, err.code);
                return -1;
            }
            console.log('checkUser :', error)
        }
    },
    getPersonal: async (idx) => {
        const query = `SELECT repName,coName,phoneNumber,location FROM ${table} WHERE userIdx="${idx}"`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (error) {
            throw error
        }
    },
    updateImg: async (insertIdx, profileImg) => {
        let query = `UPDATE ${table_user} SET img="${profileImg}" WHERE userIdx="${insertIdx}"`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('update profile ERROR : ', err);
            throw err;
        }
    },
    insertSalt: async (hashedPw, salt, userIdx) => {
        let query = `UPDATE ${table} SET password="${hashedPw}",salt="${salt}" WHERE userIdx=${userIdx}`
        try {
            await pool.queryParam(query);
            query = `SELECT * FROM ${table} WHERE userIdx="${userIdx}"`;
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('update profile ERROR : ', err);
            throw err;
        }
    },
    updateUserPasswordByEmail: async(email,hashedPw,salt)=>{
        const query = `UPDATE ${table_user} SET password="${hashedPw}", salt="${salt}" WHERE email="${email}"`
        try{
            const result = await pool.queryParam(query)
            return result;
        }catch(err){
            throw err;
        }
    },
    updateUserPassword: async(userIdx,hashedPw,salt)=>{
        const query = `UPDATE ${table_user} SET password="${hashedPw}", salt="${salt}" WHERE userIdx=${userIdx}`
        try{
            const result = await pool.queryParam(query)
            return result;
        }catch(err){
            throw err;
        }
    },
    signupEmailAndPassword:async(email,hashedPw,salt)=>{
        const query = `INSERT INTO ${table_user} (email,password,salt) VALUES ("${email}","${hashedPw}","${salt}")`
        try{
            const result = await pool.queryParam(query)
            return result.insertId;
        }catch(err){
            throw err;
        }
    },
    signupPersonalInfo:async(insertIdx,repName,coName,phoneNumber)=>{
        const query = `UPDATE ${table_user} SET repName="${repName}", coName="${coName}", phoneNumber="${phoneNumber}" WHERE userIdx=${insertIdx}`
        try{
            const result = await pool.queryParam(query)
            return result;
        }catch(err){
            throw err;
        }
    },
    signupProfileInfo:async(insertIdx,nickname,img)=>{
        const query = `UPDATE ${table_user} SET nickname="${nickname}", img="${img}" WHERE userIdx=${insertIdx}`
        try{
            const result = await pool.queryParam(query)
            return result;
        }catch(err){
            throw err;
        }
    },
    signupAssign:async(insertIdx,pushAlarm)=>{
        const query = `UPDATE ${table_user} SET pushAlarm="${pushAlarm}", isSubmit=1 WHERE userIdx=${insertIdx}`
        try{
            const result = await pool.queryParam(query)
            return result.protocol41;
        }catch(err){
            throw err;
        }
    },
    updateProfile:async(userIdx,nickname,img)=>{
        const query = `UPDATE ${table_user} SET nickname="${nickname}", img="${img}" WHERE userIdx=${userIdx}`
        try{
            const result = await pool.queryParam(query)
            return result.protocol41;
        }catch(err){
            throw err;
        }
    },
    updatePersonalInfo:async(userIdx,repName,coName,location,phoneNumber)=>{
        const query = `UPDATE ${table_user} SET repName="${repName}", coName="${coName}", location="${location}", phoneNumber="${phoneNumber}" WHERE userIdx=${userIdx}`
        try{
            const result = await pool.queryParam(query)
            return result.protocol41;
        }catch(err){
            throw err;
        }
    },
    getUserPost:async(userIdx)=>{
        const query = `SELECT postIdx,productImg,productName,expDate,coverPrice,isSold,uploadDate FROM ${table_post} WHERE userIdx=${userIdx};`
        try{
            const result = await pool.queryParam(query)
            return result;
        }catch(err){
            throw err;
        }
    },
    findImg:async(userIdx)=>{
        const query = `SELECT img FROM ${table_user} WHERE userIdx=${userIdx}`
        try{
            const result = await pool.queryParam(query)
            return result[0].img
        }catch(err){
            throw err;
        }
    },
    findNickname:async(userIdx)=>{
        const query = `SELECT nickname FROM ${table_user} WHERE userIdx=${userIdx}`
        try{
            const result = await pool.queryParam(query)
            return result[0].nickname
        }catch(err){
            throw err;
        }
    }
}

module.exports = user;
