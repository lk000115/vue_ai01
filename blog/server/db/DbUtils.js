const slqite3 = require('sqlite3').verbose();
const path = require("path");
const Genid = require("../utils/Snowflake");

var db = new slqite3.Database(path.join(__dirname, './blog.sqlite3'));


module.exports = { db, Genid}
