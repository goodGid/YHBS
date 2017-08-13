// default module
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var router = express.Router();

// custom module
var db_config = require('../../config/db_config.json');

// router.set


// router.use
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

var pool = mysql.createPool({
  host : db_config.host,
  port : db_config.port,
  user : db_config.user,
  password : db_config.password,
  database : db_config.database,
  connectionLimit : db_config.connectionLimit,
  debug : false
});

router.get('/admission',function(req,res){
    res.render('admission');
});

router.get('/course',function(req,res){
    res.render('course');
});

router.get('/expell',function(req,res){
    res.render('expell');
});

router.get('/extra',function(req,res){
    res.render('extra');
});

router.get('/facility',function(req,res){
    res.render('facility');
});

function getThumbnailList(category){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err) reject(err);
            else {
                connection.query('select * from img_BBS where category = ?', category, function(err, rows){
                    connection.release();
                    if(err) reject(err);
                    else resolve(rows);
                });
            }
        });
    });
}

function getNoticeList(){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err) reject(err);
            else {
                connection.query('select * from notice_BBS', function(err, rows){
                    connection.release();
                    if(err) reject(err);
                    else resolve(rows);
                });
            }
        });
    });
}

router.get('/grade', async function(req, res){
    try{
        var imageList = await getThumbnailList("grade");
        res.render('grade', {imgList: imageList});        
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }
});

router.get('/introduce',function(req,res){
    res.render('introduce');
});

router.get('/location',function(req,res){
    res.render('location');
});

const notification = require('./notice');
router.use('/notice',notification);


router.get('/nursery',async function(req,res){
    try{
        var imageList = await getThumbnailList("nursery");
        res.render('nursery', {imgList: imageList});        
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }
});

router.get('/policy',function(req,res){
    res.render('policy');
});

router.get('/staff', async function(req,res){
    try{
        var imageList = await getThumbnailList("staff");
        res.render('staff', {imgList: imageList});        
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }
});

router.get('/uniform',function(req,res){
    res.render('uniform');
});

router.get('/volunteer', async function(req,res){
    try{
        var imageList = await getThumbnailList("volunteer");
        res.render('volunteer', {imgList: imageList});        
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }
});

router.get('/etc', async function(req,res){
    try{
        var imageList = await getThumbnailList("etc");
        res.render('etc', {imgList: imageList});        
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }
});

module.exports = router;