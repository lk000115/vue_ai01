const slqite3 = require('sqlite3').verbose();
const path = require("path");

var db = new slqite3.Database(path.join(__dirname, './invoice.sqlite3'));

db.async = {};

db.async.all = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            resolve({ err, rows});
        });
    });
}

db.async.run = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (err, rows) => {
            resolve({err, rows});
        });
    });
}



module.exports =  db;