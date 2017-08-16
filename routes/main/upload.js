// default module
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var aws=require('aws-sdk');
var multer=require('multer');
var multerS3=require('multer-s3');

// custom module
var db_config = require('../../config/db_config.json');


var pool = mysql.createPool({
  host : db_config.host,
  port : db_config.port,
  user : db_config.user,
  password : db_config.password,
  database : db_config.database,
  connectionLimit : db_config.connectionLimit,
  debug : false
});

aws.config.loadFromPath('./config/aws_config.json');

var s3 = new aws.S3();
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'yhbs',
    acl: 'public-read',
    key: function(req, file, cb){
      cb(null,Date.now() + '.'+ file.originalname.split('.').pop());
    }
  })
});


// router.set

// router.use

/*
 Method : Get
*/

router.get('/',function(req,res){
  console.log(" / in upload.js");
  res.render('upload');
});

/*
 Method : Post
*/


router.post('/upload',upload.single('pic'), function(req, res)
{
  var imgUrlFromS3 = req.file.location;
  console.log(" imgUrl : " + imgUrlFromS3);
  res.end();
});

module.exports = router;
