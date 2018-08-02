var express = require('express');
var router  = express.Router();
var request = require('request');

var oracledb    = require('oracledb');
var db          = require('../config/database.js');

var doRelease   = function(connection) {
    connection.close(function(err) {
        if (err) console.error(err.message);
    });
}

router.get('/', function(req, res, next) {
    res.json({'message' : 'Welcome to dosenjaga'});
});

router.post('/login', function(req, res, next) {
    var username    = req.body.username;
    var password    = req.body.password;
    var status      = req.body.status;
    var nrpNip;

    var setNrpNip = function(resbody, start, status, req, res) {
        nrpNip = resbody.substring(start, resbody.length);
        console.log("Nrp Nip : " + nrpNip);
    
        checkLogin(nrpNip, status, req, res);
    }
    
    if (status == 'dosen') {
        request({
            url     : 'http://lecturer.pens.ac.id/status/index.php?username='+ username +'&pass='+ Buffer.from(password).toString('base64') +'&dn=dosen', 
            method  : 'GET',
            headers : {},
        }, function(error, response, body){
            if(error) {
                res.json({error : error});
            } else {
                setNrpNip(body, 8, status, req, res);
            }
        });
    } else {
        request({
            url     : 'http://student.pens.ac.id/confirmx.php?user='+ username +'&passwd='+ Buffer.from(password).toString('base64'), 
            method  : 'GET',
            headers : {},
            body: ''
        }, function(error, response, body){
            if(error) {
                res.json({
                    error : error
                });
            } else {
                // console.log(body);
                setNrpNip(body, 3, status, req, res);
            }
        });
    }
});

var checkLogin = function(noNrpNip, status, req, res) {
    oracledb.getConnection(db, function(err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }
        if (status == 'dosen') {
            query = "select * from PEGAWAI where nip = '" + noNrpNip + "'";
        } else {
            query = "select * from MAHASISWA where nrp = '" + noNrpNip + "'";
        }
        connection.execute(query, function(err, result) {
            if (err) {
                console.error(err.message);
                doRelease(connection);
                return;
            }
            console.log("Test:\n");
            if (result.rows.length != 0) {
                res.json({
                    username    : req.body.username,
                    name        : (status == 'dosen' ? result.rows[0]['3'] : result.rows[2]),
                    jabatan     : status,
                    image       : './images/user.png'
                });
            } else {
                res.json({
                    message     : 'Data not found'
                });
            }
            // res.json(result.rows);
            doRelease(connection);
        }
        );
    });
}

module.exports = oracledb;
module.exports = router;