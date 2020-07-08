const pool = require('../modules/pool');
const table = 'user';
const crypto = require('crypto');

const user = {
    signup: async(email,password,salt,nickname,repName,coName,img,longitude,latitude,location,phoneNumber,recordTime,orderTime,isSubscribed)=>{
        const fields = 'email,password,salt,nickname,repName,coName,img,longitude,latitude,location,phoneNumber,recordTime,orderTime,isSubscribed'
        const values = [email,password,salt,nickname,repName,coName,img,longitude,latitude,location,phoneNumber,recordTime,orderTime,isSubscribed]

        const query = `INSERT INTO ${table}(${fields}) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
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
        const query = `SELECT email,nickname,repName,coName,img,longitude,latitude,location,phoneNumber,recordTime,orderTime,isSubscribed FROM ${table} WHERE idx="${idx}"`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(error){
        throw error
        }
    },

    // -password -salt
    getUserByIdx:async(idx)=>{
        const query = `SELECT * FROM ${table} WHERE idx="${idx}"`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(error){
        throw error
        }
    },
    
    deleteUser:async(idx)=>{
        const query = `DELETE FROM ${table} WHERE idx=${idx}`
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
