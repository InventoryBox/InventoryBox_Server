const itemModel = require('../models/item');
const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const encrypt = require('../modules/crypto');
const jwt = require('../modules/jwt');

const record = {
    home : async (req,res)=>{
        const {
         select,
         date   
        } = req.params;
        // params 값 확인
        if(!select || !date )
        {
            res.status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
    },
    func2 : async (req,res)=>{
    }
}

module.exports = record;