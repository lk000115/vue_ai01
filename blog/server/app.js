const express  = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const port = 3000;
const path = require("path");

//处理跨域
app.use(cors());
//处理Json数据
app.use(express.json());

//把上传的文件存放此临时目录
const upload = multer({ dest: './public/upload/temp' });
app.use(upload.any());



 app.use('/db', require('./routers/TestRouter'));
 app.use("/admin", require('./routers/AdminRouter'))

app.get("/", (req, res)=> {
    res.send("Hello World");
})


app.listen(port, () => {
    console.log(`服务器已经启动:  http://localhost:${port}`)
})

