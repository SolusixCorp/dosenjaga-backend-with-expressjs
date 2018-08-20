var express = require('express');
var router  = express.Router();
var request = require('request');

var oracledb    = require('oracledb');
var db          = require('../config/database.js');

router.get('/:no', function(req, res, next) {
    var nomor = parseInt(req.params.no);

    oracledb.getConnection(db, function(err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }
        
        query = "select a.*, b.* from mahasiswa_semester a, mahasiswa b where a.kuliah = :no";
        
        connection.execute(query,
            [nomor],
            {
                outFormat: oracledb.OBJECT
            }, 
            function(err, result) {
            if (err) {
                console.error(err.message);
                res.json({
                    message : err.message
                });
            }
            // console.log("Test:\n");
            if (result.rows.length != 0) {
                res.json(result.rows);
            } else {
                res.json({
                    message     : 'Data not found'
                });
            }
        });
    });
});


module.exports = router;