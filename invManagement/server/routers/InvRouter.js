const express = require('express');
const router = express.Router();
const db = require("../db/DbUtils");

//查询单个发票接口  /inv/detail?invNumber=***
router.get('/detail',async (req, res)=>{
    let invNumber = req.query.invNumber;
    let sql = "select * from invList where invNumber=?"
    let {err,rows} = await db.async.get(sql,[invNumber])
    if(err == null) {
        res.send({code: 200, msg: "查询成功",data:rows})
    } else {
        res.send({code: 500, msg: "查询失败"})
    }
})





//查询接口   /inv/list
router.get('/list',async (req, res)=>{
    let sql = "select * from invList"
    let {err,rows} = await db.async.all(sql)
    if(err == null) {
        res.send({code: 200, msg: "查询成功",data:rows})
    }else{
        res.send({code: 500, msg: "查询失败"})
    }
})

//新增接口   /inv/add

router.post('/add',async (req, res)=>{
    let {invNumber,invAmount,invDate} = req.body
    let createDate = new Date().getTime();
    let sql = "insert into invList ('invNumber','invAmount','invDate','createDate') values(?,?,?,?)"
    let paramas = [invNumber,invAmount,invDate,createDate];
    let {err,rows} = await db.async.run(sql,paramas);
    if(err == null) {
        console.log(rows);
        res.send({code: 200, msg: "添加成功---",data:rows})
    }else{
        res.send({code: 500, msg: "添加失败",data:err})
    }
})

// 修改接口  /inv/update
router.put('/update',async (req, res)=>{
    let {invNumber,invCompany,notes} = req.body
    let createDate = new Date().getTime();
    let update_sql = "update invList set  createDate=? ,invCompany=?,notes=?  where invNumber=?"
    let paramas = [createDate,invCompany,notes,invNumber];
    let {err,rows} = await db.async.run(update_sql,paramas);
    if(err == null) {
        console.log(rows);
        res.send({code: 200, msg: "修改成功---",data:rows})

    } else {
        res.send({code: 500, msg: "修改失败",data:err})
    }
})

//删除接口 /inv/delete?invNumber=***
router.delete("/delete", async (req, res)=>{
    let invNumber = req.query.invNumber;
    const delete_sql = "delete from invList  where invNumber=?"
    let {err,rows} = await db.async.run(delete_sql,[invNumber]);
    if(err == null) {
        res.send({code: 200, msg: "删除成功",data:rows})
    }else{
        res.send({code: 500, msg: "删除失败"})
    }
})





module.exports = router;