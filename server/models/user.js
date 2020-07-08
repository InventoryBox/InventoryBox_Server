const pool = require('../modules/pool');
<<<<<<< HEAD
const table = 'user';
const crypto = require('crypto');

const user = {
    signup: async(email,password,salt,nickname,repName,coName,img,longitude,latitude,location,phoneNumber,recordTime,orderTime,isSubscribed)=>{
        const fields = 'email,password,salt,nickname,repName,coName,img,longitude,latitude,location,phoneNumber,recordTime,orderTime,isSubscribed'
        const values = [email,password,salt,nickname,repName,coName,img,longitude,latitude,location,phoneNumber,recordTime,orderTime,isSubscribed]

        const query = `INSERT INTO ${table}(${fields}) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        try{
            const result = await pool.queryParamArr(query,values);
            const insertIdx = result.insertIdx;
            return insertIdx;
        }catch(err){
            throw err
        }
    },
    signin:async()=>{

    },
    email:async()=>{

    },
    find_id:async()=>{

    },
    getUser:async()=>{

    },
    getNicknamePicture:async()=>{

    },
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
    deleteUser:async()=>{

    }

}



module.exports=user;
=======
const user = {
    func1: async () => {
    }
}

module.exports = user;
>>>>>>> develop
