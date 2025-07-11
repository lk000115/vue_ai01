
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

// app.get('/list', (req, res) => {
//   // 模拟返回数据
//    res.send("Hello World-----");
// });


app.use('/inv',require('./routers/InvRouter'))

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});