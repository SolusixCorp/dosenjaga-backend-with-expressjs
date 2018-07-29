var express = require('express');
var router = express.Router();
var request = require('request');
// var Buffer = require('buffer');


router.get('/', function(req, res, next) {
    res.json({'message' : 'Welcome to dosenjaga'});
});

router.post('/login', function(req, res, next) {
    var username    = req.body.username;
    var password    = req.body.password;
    var status      = req.body.status;

    res.json({
        username    : username,
        name        : 'Nama User',
        jabatan     : status,
        image       : './images/user.png'
    });
    
    if (status == 'dosen') {
        request({
            url     : 'http://lecturer.pens.ac.id/status/index.php', 
            query   : {
                username    : username,
                pass        : new Buffer(password).toString('base64'),
                dn          : 'dosen'
            },
            method  : 'GET',
            headers : {},
            body: ''
        }, function(error, response, body){
            if(error) {
                res.json({
                    error : error
                });
            } else {
                res.send(body);
            }
        });
    } else {
        request({
            url     : 'http://student.pens.ac.id/confirmx.php', 
            query   : {
                user        : username,
                passwd      : new Buffer(password).toString('base64')
            },
            method  : 'GET',
            headers : {},
            body: ''
        }, function(error, response, body){
            if(error) {
                res.json({
                    error : error
                });
            } else {
                res.send(body);
            }
        });
    }

    
});

module.exports = router;