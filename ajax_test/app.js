//引入express模块,创建服务器
const express = require('express');

const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));


app.get('/first', (req, res) => {
  res.send({"name":"zhangsan------"});
});

app.get('/get', (req, res) => {
  res.send({"name":"zhangsan","age":18});
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});