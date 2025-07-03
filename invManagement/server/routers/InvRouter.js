const express = require('express');
const router = express.Router();
const db = require("../db/DbUtils");


router.get('/list',async (req, res)=>{
    let sql = "select * from invList"
    let {err,rows} = await db.async.all(sql)
    if(err == null) {
        res.send({code: 200, msg: "查询成功",data:rows})
    }else{
        res.send({code: 500, msg: "查询失败"})
    }
})







module.exports = router;