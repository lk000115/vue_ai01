const slqite3 = require('sqlite3').verbose();
const path = require("path");
const Genid = require("../utils/Snowflake");

var db = new slqite3.Database(path.join(__dirname, './blog.sqlite3'));
var genid = new Genid({ WorkerId: 1 });

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




module.exports = { db, genid };
