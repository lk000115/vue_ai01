
const express  = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cors = require("cors");
app.use(cors());


app.get("/", (req, res)=> {
    res.send("Hello World");
})



app.use('/inv',require('./routers/InvRouter'))



//服务器启动并监听端口
app.listen(port, () => {
    console.log(`服务器已经启动:  http://localhost:${port}`)
})