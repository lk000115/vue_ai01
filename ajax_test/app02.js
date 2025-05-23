const express = require('express');
const path = require('path');
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const port = 3000;
const cors = require('cors');


app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use("/db",require("./public/js/messRouter"));

app.get("/",(req, res,)=>{
    res.send("hello world");
})




app.listen(port, () => {

    console.log(`服务器已经运行成功: http://localhost:${port}`);
})
