var express = require('express');
var router  = express.Router();
var request = require('request');

var oracledb    = require('oracledb');
var db          = require('../../config/database.js');

router.post('/find', function(req, res, next) {
    var nomor = parseInt(req.body.nomor);

    oracledb.getConnection(db, function(err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }
        
        query = "select a.*, d.hari, e.matakuliah, f.jurusan " +
                "from KULIAH_DOSEN_JAGA a, PEGAWAI b, KULIAH c, HARI d, MATAKULIAH e, JURUSAN f " +
                "where a.pegawai = b.nomor and a.kuliah = c.nomor and " +
                "a.hari = d.nomor and a.kuliah = e.nomor and e.jurusan = f.nomor and a.pegawai = :nomor";
        
        connection.execute(query,
            [nomor],
            {
                outFormat: oracledb.OBJECT
            }, 
            function(err, result) {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log("Test:\n");
            if (result.rows.length != 0) {res.json(result.rows)  
                res.json(result.rows);
                // storeData(result.rows);
            } else {
                res.json({
                    message     : 'Data not found'
                });
            }
        });

        var storeData = function(result) {

        }
    });
});

module.exports = router;