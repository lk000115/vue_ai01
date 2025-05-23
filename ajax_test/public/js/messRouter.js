const express = require('express');
const router = express.Router();
const {db} = require("../db/dbutils.js");

router.get("/test", (req,res)=> {
    // res.send("ok!!!");
    db.all("SELECT * FROM message",[], (err, rows)=> {
        if(err) {
            console.log(err.message);
            res.send("Internal Server Error");
        }else{

            res.send(rows);
        }
    })

})

router.post("/add", (req,res)=> {
    let message = req.body;
    db.run("INSERT INTO message ('id', 'title', 'content','creat_time') VALUES (?,?,?,?)", [new Date().getTime(), message.title, message.content, new Date().getTime()], 
        (err,rows)=> {
        if(err == null) {
            res.send({
                "code": 200,
                "message": "数据添加成功"
            })
        }else{
             res.send({
                "code": 500,
                "message": "数据失败"
            })
        }
            
        }   
    )

})




module.exports = router;
