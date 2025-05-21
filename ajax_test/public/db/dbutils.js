const path = require('path');

//创建数据库实例对象
var sqlite3 = require('sqlite3').verbose();
//创建连接数据库的对象
var db = new sqlite3.Database(path.join(__dirname,'./test.sqlite3'));


module.exports = {db};