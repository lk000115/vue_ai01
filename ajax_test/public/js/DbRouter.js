const express = require('express');
const fs = require('fs');
const path = require('path');

var router = express.Router();
// 引入数据库模块,连接数据库SQLITE3
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(path.join(__dirname,'../db/test.sqlite3'));


router.get("/testlist", (req,res)=>{
    db.all("SELECT * FROM user",[], function(err, rows) {
    if (err) {
    //   console.log(path.join(__dirname,'../db/test.sqlite3'));
      console.error(err.message);
      res.send("Internal Server Error");
    } else {
      res.send(rows);
    }
  });     
})



module.exports = router;
