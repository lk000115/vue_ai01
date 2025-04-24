//引入express模块,创建服务器
const express = require('express');

const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");   //引入body-parser模块,解析post请求的参数
const app = express();

app.use(bodyParser.urlencoded());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));


app.get('/first', (req, res) => {
  res.send({"name":"zhangsan------"});
});

app.get('/get', (req, res) => {
  res.send(req.query);
})

app.post('/post', (req, res) => {
  // console.log(req.body);
  res.send(req.body);
  })

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});