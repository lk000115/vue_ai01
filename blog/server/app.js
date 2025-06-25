const express  = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const {db,genid} = require("./db/DbUtils");

//处理跨域
app.use(cors());
//处理Json数据
app.use(express.json());

//把上传的文件存放此临时目录
const upload = multer({ dest: './public/upload/temp' });
app.use(upload.any());
//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))

//登陆验证中间件
const ADMIN_TOKEN_PATH = "/_token";

app.all('',  async (req, res, next) => {
    if(req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
        let { token } = req.headers;

        let admin_token_sql = "select * from admin where token = ?";
        let adminResult = await db.async.all(admin_token_sql, [token]);
        if(adminResult.err != null || adminResult.rows.length == 0) {
            res.send({
                code: 403,
                msg: "请先登录"
            })
            return
        }else{
            next();
        }

    }else{
        next();
    }

})

app.use('/db', require('./routers/TestRouter'));
app.use("/admin", require('./routers/AdminRouter'))
app.use("/category", require('./routers/CategoryRouter'))
app.use("/blog", require("./routers/BlogRouter"));
app.use("/upload", require("./routers/UploadRouter"));


app.get("/", (req, res)=> {
    res.send("Hello World");
})


app.listen(port, () => {
    console.log(`服务器已经启动:  http://localhost:${port}`)
})

