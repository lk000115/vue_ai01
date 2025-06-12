const express = require('express');
const router = express.Router();
const {db,genid} = require("../db/DbUtils");

//添加接口 /catagory/add
router.post("/_token/add", async (req, res)=>{
    let {name} = req.body;
    const insert_sql = "insert into category ('id','name') values (?,?)"
    let {err,rows} = await db.async.run(insert_sql,[genid.NextId(),name]);

    if(err == null) {
        res.send({code: 200, msg: "添加成功",data:rows})
    }else{
        res.send({code: 500, msg: "添加失败"})
    }
})

//修改接口 /catagory/update
router.put("/_token/update", async (req, res)=>{
    let {name,id} = req.body;
    const insert_sql = "update category set name=? where id=?"
    let {err,rows} = await db.async.run(insert_sql,[name,id]);

    if(err == null) {
        res.send({code: 200, msg: "修改成功",data:rows})
    }else{
        res.send({code: 500, msg: "修改失败"})
    }
})

//删除接口 /catagory/delete?id=****
router.delete("/_token/delete", async (req, res)=>{
    let id = req.query.id;
    const delete_sql = "delete from category  where id=?"
    let {err,rows} = await db.async.run(delete_sql,[id]);

    if(err == null) {
        res.send({code: 200, msg: "删除成功",data:rows})
    }else{
        res.send({code: 500, msg: "删除失败"})
    }
})

//查询接口 /catagory/list

router.get("/list", async (req, res)=>{
    const search_sql = "select * from category"
    let {err,rows} = await db.async.all(search_sql,[]);

    if(err == null) {
        res.send({code: 200, msg: "获取数据成功",data:rows})
    }else{
        res.send({code: 500, msg: "获取数据失败"})
    }
})




module.exports = router;