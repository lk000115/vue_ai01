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
//文件上传接口
router.post("/upload", (req,res)=>{
   //检测是否有文件上传
   if(!req.files) {
      res.send({
        code: 400,
        msg: '上传文件不能为空',       
      });
      return;
  }
  //保存文件
  let files = req.files;
  //因为可能上传多个文件,用数组保存
  let ret_files = [];
  //遍历文件数组,保存文件到指定目录 
  for (let file of files ) {
     //获取文件名后缀
     let file_ext = file.originalname.substring(file.originalname.lastIndexOf('.') + 1 );
     //使用时间戳为文件名称
     let file_name = new Date().getTime() + '.' + file_ext;
     //保存文件到指定目录
     fs.renameSync(
        process.cwd() + '/public/upload/temp/' + file.filename,
        process.cwd() + '/public/upload/' + file_name,
     );
     ret_files.push("/public/upload/" + file_name);
  } 
   
  res.send({
    code: 200,
    msg: '上传成功',
    data: ret_files, 
  })
  
})

//文件下载,在浏览器中输入http://localhost:3000/?file_name=文件全名, 下载文件
router.get("/download", async (req,res)=>{
  //获取文件名
  let file_name = req.query.file_name;
  //获取文件路径
  let file_path = process.cwd() + '/public/upload/' + file_name;
  res.download(file_path) 
})
 
module.exports = router;
