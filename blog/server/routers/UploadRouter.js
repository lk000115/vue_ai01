//上传文件
const express = require('express');
const router = express.Router();
const {db,genid} = require("../db/DbUtils");
const fs = require("fs");


router.post("/refile", async (req, res)=>{
    console.log(req.files)
    if (!req.files) {
        res.send({
          "errno": 1, // 只要不等于 0 就行
          "message": "上传失败"
        })
        return;
    }
    
      let files = req.files;
      //因为可能上传多个文件,用数组保存
      let ret_files = [];
      //遍历文件数组,保存文件到指定目录 
      for (let file of files ) {
         //获取文件名后缀
         let file_ext = file.originalname.substring(file.originalname.lastIndexOf('.') + 1 );
         //使用时间戳为文件名称
         let file_name = genid.NextId() + '.' + file_ext;
         //保存文件到指定目录
         fs.renameSync(
            process.cwd() + '/public/upload/temp/' + file.filename,
            process.cwd() + '/public/upload/' + file_name,
         );
         ret_files.push("/public/upload/" + file_name);
      } 
      
      res.send({
        "errno": 0, 
        "data":{
          "url": ret_files[0] 
        }
    
    })

})



module.exports = router