const express = require('express');
const router = express.Router();
const db = require("../db/DbUtils");

//查询单个发票接口  /api/detail?invNumber=***
router.get('/detail',async (req, res)=>{
    let invNumber = req.query.invNumber;
    // console.log('invNumber---',invNumber);
    let sql = "select * from invList where invNumber=?"
    let {err,rows} = await db.async.all(sql,[invNumber])
    if(err == null && rows.length > 0) {
        res.send({code: 200, msg: "查询成功",data:rows})
    } else {
        res.send({code: 500, msg: "查询失败"})
    }
})

// 新建分页显示接口 /api/search
router.get('/search', async (req, res) => {
    // 获取查询参数并设置默认值
    // const invCompany = req.query.invCompany || '';
    // const invNumber = req.query.invNumber || '';
     const keyword = req.query.keyword || '';
    const currentPage = parseInt(req.query.currentPage) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // 计算偏移量
    const offset = (currentPage - 1) * pageSize;

    // 构建查询条件
    let whereClause = '';
    const params = [];

    // if (invCompany || invNumber) {
    //     whereClause += 'WHERE ';
    //     if (invCompany) {
    //         whereClause += 'invCompany LIKE ? ';
    //         params.push(`%${invCompany}%`);
    //         if (invNumber) {
    //             whereClause += 'AND invNumber LIKE ? ';
    //             params.push(`%${invNumber}%`);
    //         }
    //     } else {
    //         whereClause += 'invNumber LIKE ? ';
    //         params.push(`%${invNumber}%`);
    //     }
    // }

    if (keyword) {
        whereClause += 'WHERE (invCompany LIKE ? OR invNumber LIKE ? OR notes LIKE ?) ';
        params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }


    // 构建统计总记录数的 SQL 语句
    const countSql = `SELECT COUNT(*) as total FROM invList ${whereClause}`;
    let { err, rows } = await db.async.all(countSql, params);
    if (err || rows.length === 0) {
        return res.send({ code: 500, msg: "查询总记录数失败" });
    }
    const total = rows[0].total;
    const pageCount = Math.ceil(total / pageSize);

    // 构建查询记录的 SQL 语句
    const selectSql = `SELECT * FROM invList ${whereClause} ORDER BY createDate DESC LIMIT ? OFFSET ?`;
    const selectParams = [...params, pageSize, offset];
    ({ err, rows } = await db.async.all(selectSql, selectParams));
    if (err || rows.length === 0) {
        return res.send({ code: 500, msg: "查询记录失败" });
    }

    // 返回结果
    res.send({
        code: 200,
        msg:  "查询成功",
        currentPage,
        pageSize,
        pageCount,
        rows
    })

});          



//查询接口   /api/list
router.get('/list',async (req, res)=>{
    let sql = "select * from invList"
    let {err,rows} = await db.async.all(sql)
    if(err == null) {
        res.send({code: 200, msg: "查询成功",data:rows})
    }else{
        res.send({code: 500, msg: "查询失败"})
    }
})

//新增接口   /api/add

router.post('/add',async (req, res)=>{
    let {invNumber,invAmount,invDate} = req.body
    let createDate = new Date().getTime();
    let sql = "insert into invList ('invNumber','invAmount','invDate','createDate') values(?,?,?,?)"
    let paramas = [invNumber,invAmount,invDate,createDate];
    let {err,rows} = await db.async.run(sql,paramas);
    // console.log(rows);
    if(err == null && invNumber.length > 0) {
        res.send({code: 200, msg: "添加成功---",data:rows})
    }else{
        res.send({code: 500, msg: "添加失败",data:err})
    }
})

// 修改接口  /api/update
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

//删除接口 /api/delete?invNumber=***
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