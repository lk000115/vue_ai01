//引入express模块,创建服务器
const express = require('express');

const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");   //引入body-parser模块,解析post请求的参数
const app = express();

// 解析 application/x-www-form-urlencoded 类型的请求体
// app.use(bodyParser.urlencoded());
app.use(express.urlencoded({ extended: false }));
// 解析 application/json 类型的请求体
app.use(express.json());
// app.use(bodyParser.json());
// 允许跨域
app.use(cors());

//定义应用中间件函数
 function myLog(req, res, next) {
    console.log('LOGGED');
    next();
  }  

// 静态文件目录,public目录下的文件可以直接访问,比如  http://localhost:3000/ajax02.html
app.use(express.static(path.join(__dirname, 'public')));

app.use('/db', require('./public/js/DbRouter'));

// 定义路由,路由就是匹配url后执行相应回调函数
app.get('/first', (req, res) => {
  res.send(req.query);
});

app.get('/get',myLog, (req, res) => {
  res.send(req.query);
})

app.post('/first', (req, res) => {
  console.log('$$',req.body);
  res.send(req.body);
  })

app.post('/post', (req, res) => {
  // console.log(req.params);
  res.send(req.body);
  })

// 启动服务器,监听3000端口  
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});