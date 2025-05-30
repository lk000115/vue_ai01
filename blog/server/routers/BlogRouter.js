const express = require('express');
const router = express.Router();
const {db,genid} = require("../db/DbUtils");

//查询接口 /blog/list
router.get("/list", async (req, res)=>{
    const search_sql = "select * from blog"
    let {err,rows} = await db.async.all(search_sql,[]);

    if(err == null) {
        res.send({code: 200, msg: "修改成功",data:rows})
    }else{
        res.send({code: 500, msg: "修改失败"})
    }
})




module.exports = router