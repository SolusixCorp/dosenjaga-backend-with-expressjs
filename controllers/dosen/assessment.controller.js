var express = require('express');
var router  = express.Router();
var request = require('request');

var oracledb    = require('oracledb');
var db          = require('../../config/database.js');

router.get('/:kuliah', function(req, res, next) {
    var kuliah = parseInt(req.params.kuliah);

    oracledb.getConnection(db, function(err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }
        
        query = "select * from TUGAS where KULIAH = :kuliah";
        
        connection.execute(query,
            [kuliah],
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

router.post('/create', function(req, res, next) {
    var kuliah          = parseInt(req.body.kuliah);
    var judul           = req.body.judul;
    var catatan         = req.body.catatan;
    var tanggal         = req.body.tanggal;
    var tanggal_entri   = req.body.tanggal_entri;

    oracledb.getConnection(db, function(err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }
        
        query = "select nomor from tugas where rownum <= :num order by nomor desc";
        
        connection.execute(query,
            [1],
            function(err, result) {
            if (err) {
                console.error(err.message);
            }
            
            nomor = parseInt(result.rows[0][0]+1);
            
            oracledb.getConnection(db, function(err, connection) {
                if (err) {
                    console.error(err.message);
                    return;
                }
        
                query = "insert into TUGAS (nomor, kuliah, judul, catatan, tanggal, tanggal_entri) " +
                        "values(:nomor, :kuliah, 'ostea', 'ostear', " + 
                        "TO_DATE('2018/08/28 00:00:00','yyyy/mm/dd hh24:mi:ss'), "+
                        "TO_DATE('2018/08/28 00:00:00','yyyy/mm/dd hh24:mi:ss'))";
                
                        // res.json(kuliah);
                connection.execute(query,
                    [nomor, kuliah], 
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    }, 
                    function(err, result) {
                    if (err) {
                        console.error(err.message);
                        res.json({
                            message : err.message
                        });
                    }
                    
                    res.json({
                        message     : 'Success saving data !'
                    });
                });
            });
        });
    });
    
});

module.exports = router;