const express = require('express');
const router = express.Router();
const {db} = require("../db/dbutils.js");

router.get("/test", (req,res)=> {
    // res.send("ok!!!");
    db.all("SELECT * FROM message",[], (err, rows)=> {
        if(err) {
            console.log(err.message);
            res.send("Internal Server Error");
        }else{

            res.send(rows);
        }
    })

})



module.exports = router;
