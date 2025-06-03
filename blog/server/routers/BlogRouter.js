const express = require('express');
const router = express.Router();
const {db,genid} = require("../db/DbUtils");

//查询接口 /blog/list
router.get("/search", async (req, res)=>{
    let {keyword,categoryid,page,pagesize} = req.query;
    //验证输入,设置默认值
    page = page == null ? 1 : page;
    pagesize = pagesize == null ? 10 : pagesize;
    categoryid = categoryid == null ? 0 : categoryid ;
    keyword = keyword == null ? "" : keyword ;
    
    let params = [] ;
    let whereSqls = [] ;

    if(categoryid != 0) {
        whereSqls.push("category_id = ?") ;
        params.push(categoryid) ;
    }
    if(keyword != "") {
        whereSqls.push("title LIKE ? or content LIKE ? ") ;
        params.push("%"+keyword+"%") ;
        params.push("%"+keyword+"%");
    }

    let whereSqlStr = ""
    if(whereSqls.length > 0) {
        whereSqlStr = "where " + whereSqls.join(" and ") ;
    }
    
    let search_sql = "select * from blog " + whereSqlStr + 'order by create_time '  + "DESC LIMIT ? ,?"
    let serach_sql_params = params.concat([(page-1)*pagesize,pagesize]) ;
    
 
    let search_count_sql = "select count(*) as total from blog " + whereSqlStr ;
    let search_count_params = params ;
 
    let searchResult = await db.async.all(search_sql,serach_sql_params);
    let searchCountResult = await db.async.all(search_count_sql,search_count_params);
    

    if(searchResult.err == null) {
        res.send({
             code: 200,
             msg: "查询成功",
             data:{
                keyword,
                categoryid,
                page,
                pagesize,
                rows:searchResult.rows,
                total:searchCountResult.rows[0].total
             }
            })
    }else{
        res.send({code: 500, msg: "查询失败"})
    }
})

//添加接口 /blog/add
router.post("/add", async (req, res)=>{
    let {title,categoryid,content} = req.body;
    let id = genid.NextId();
    let create_time = new Date().getTime();
    const insert_sql = "insert into blog ('id','category_id','title','content','create_time') values (?,?,?,?,?)"
    let paramas = [id,categoryid,title,content,create_time]
    let {err,rows} = await db.async.run(insert_sql,paramas);

    if(err == null) {
        res.send({code: 200, msg: "添加成功",data:rows})
    }else{
        res.send({code: 500, msg: "添加失败"})
    }
})

//修改接口 /blog/update

router.put("/update", async (req, res)=>{
    let {id,title,categoryid,content} = req.body;
    let create_time = new Date().getTime();
    const update_sql = "update blog set category_id=?,title=?,content=?,create_time=? where id=?"
    let paramas = [categoryid,title,content,create_time,id]
    let {err,rows} = await db.async.run(update_sql,paramas);

    if(err == null) {
        res.send({code: 200, msg: "添加成功",data:rows})
    }else{
        res.send({code: 500, msg: "添加失败"})
    }
})

//删除接口 /blog/delete?id=****
router.delete("/delete", async (req, res)=>{
    let id = req.query.id;
    const delete_sql = "delete from blog  where id=?"
    let {err,rows} = await db.async.run(delete_sql,[id]);

    if(err == null) {
        res.send({code: 200, msg: "删除成功",data:rows})
    }else{
        res.send({code: 500, msg: "删除失败"})
    }
})



module.exports = router