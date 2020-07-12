const pool = require('../modules/pool');
const table = 'user';
const crypto = require('crypto');

const user = {
    signup: async(email,password,salt,nickname,repName,coName,phoneNumber)=>{
        const fields = 'email,password,salt,nickname,repName,coName,phoneNumber'
        const values = [email,password,salt,nickname,repName,coName,phoneNumber]

        const query = `INSERT INTO ${table}(${fields}) VALUES(?,?,?,?,?,?,?)`
        try{
            const result = await pool.queryParamArr(query,values);
            const insertIdx = result.insertId;
            console.log(insertIdx)
            return insertIdx;
        }catch(err){
            throw err
        }
    },
    signin:async(email,password)=>{
        const query = `SELECT * FROM ${table} WHERE email="${email}"`
        try{
            const userData = await pool.queryParam(query);
            const hashedPw = crypto.pbkdf2Sync(password,userData[0].salt,1,32,'sha512').toString('hex')

            console.log(userData[0].password)
            console.log(hashedPw)
            if(userData[0].password === hashedPw){
                return true
            }else{
                return false
            }
        }catch(error){
           throw error
        }
    },
    findEmail:async(repName,coName,phoneNumber)=>{
        const query = `SELECT * FROM ${table} WHERE repName="${repName}" AND coName="${coName}" AND phoneNumber="${phoneNumber}"`
        try{
            const findEmail = await pool.queryParam(query)
            return findEmail[0].email
        }catch(err){
            throw err
        }

    },
    getUserByEmail:async(email)=>{
        const query = `SELECT * FROM ${table} WHERE email="${email}"`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(error){
        throw error
        }
    },
    
    getUserByIdxCustom:async(idx)=>{
        const query = `SELECT email,nickname,repName,coName,img,location,phoneNumber FROM ${table} WHERE userIdx="${idx}"`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(error){
        throw error
        }
    },

    // -password -salt
    getUserByIdx:async(idx)=>{
        const query = `SELECT * FROM ${table} WHERE userIdx="${idx}"`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(error){
        throw error
        }
    },
    
    deleteUser:async(idx)=>{
        const query = `DELETE FROM ${table} WHERE userIdx=${idx}`
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(error){
        throw error
        }
    },
    checkUser:async(email)=>{
        const query = `SELECT * FROM ${table} WHERE email="${email}"`;
        try{
            const result = await pool.queryParam(query);
            if(result.length===0){
                return false;
            }else return true;
        }catch(error){
            if(error.errno=1062){
                console.log('checkUser ERROR :',err.errno,err.code);
                return -1;
            }
            console.log('checkUser :',error)
        }
    },getPersonal:async(idx)=>{
        const query = `SELECT repName,coName,location FROM ${table} WHERE userIdx="${idx}"`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(error){
        throw error
        }
    },updateImg: async (insertIdx, profileImg) => {
        let query = `UPDATE ${table} SET img="${profileImg}" WHERE userIdx="${insertIdx}"`;
        try {
            await pool.queryParam(query);
            query = `SELECT email, img FROM ${table} WHERE userIdx="${insertIdx}"`;
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('update profile ERROR : ', err);
            throw err;
        }
    },
    insertSalt: async(hashedPw,salt,userIdx)=>{
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

    }
}


/*
보류
getPersonal:async()=>{

    },
    updateAlarm:async()=>{

    },
    updatePersonal:async()=>{

    },
    updateEmail:async()=>{

    },
    updateProfile:async()=>{

    },
*/


module.exports=user;
