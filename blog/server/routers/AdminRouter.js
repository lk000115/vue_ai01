const express = require('express');
const router = express.Router();
const {db,genid} = require("../db/DbUtils");
const {v4: uuidv4} = require('uuid');



router.post("/login", async (req,res)=> {
    let {account,password} = req.body;
    let {err,rows} = await db.async.all("select * from admin where account = ? and password = ?",[account,password]);

    if(err == null && rows.length > 0) {
        let login_token = uuidv4();
        let update_token_sql = "update admin set token= ? where id = ?"
        await db.async.run(update_token_sql,[login_token,rows[0].id]);

    
        let admin_info = rows[0];
        admin_info.token = login_token;
        admin_info.password = "";
        res.send({
            code: 200,
            msg: "登陆成功",
            data: admin_info
        });
        
         }else{
            res.send({
            code: 500,
            msg: "登陆失败" 
           })
    }

})

module.exports = router;

