//引入http模块，创建服务器，监听端口，处理请求，响应数据
let http = require('http');
let server = http.createServer(function (request, response) {
    response.end("hello world----")
});

server.listen(4000, function (err) {
     if (!err) {
        console.log("服务器启动成功了");
        
     } else {
        console.log(err);
     }
})
