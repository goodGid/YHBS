
//52.78.124.103:3000/lists
const express = require('express');
const aws = require('aws-sdk');
const multer = require('multer'); //이미지 업로드 모듈
const async = require('async');
const multerS3 = require('multer-s3'); //AWS S3접속용 모듈
const router = express.Router();
const jwt = require('jsonwebtoken'); //JWT토큰사용용 모듈
const moment = require('moment'); //시간형식 관리용 모듈
aws.config.loadFromPath('./config/aws_config.json'); // AWS 접속설정파일
const pool = require('../../config/db_pool'); // AWS RDS접속설정파일
const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'befreshcommunity',
        acl: 'public-read',
        key: function(req, file, cb) {
            cb(null, Date.now() + '.' + file.originalname.split('.').pop());
        }
    })
});


router.post('/',upload.single('image'), function(req, res){ //multer 쓰므로 두번째 인자에 image 넘겨줌. 1개면 single 여러개면 array, multer 레퍼런스 찾으면 더 나옴
  let task_array = [
    //1. connection 설정
    function(callback){
      pool.getConnection(function(err, connection){
            if(err){
          res.status(500).send({
            msg : "500 Connection error"
          });
          callback("getConnecntion error at login: " + err, null);
        }
            else callback(null, connection);
         });
      },
    //2. header의 token 값으로 user_email 받아옴.
    function(connection, callback){
      let token = req.headers.token;
      jwt.verify(token, req.app.get('jwt-secret'), function(err, decoded){
        if(err){
          res.status(501).send({
            msg : "501 user authorization error"
          });
          connection.release();
          callback("JWT decoded err : "+ err, null);
        }
        else callback(null, decoded.user_email, connection);
      });
    },
    //3. 
    function(userEmail, connection, callback){
      let registQuery = 'insert into my_recipe set ?';
      let imageUrl = req.file.location;
      //width, height 설정은 안드, iOS에서 사진띄울때 썸네일 레이아웃 안깨지게 사진크기 비율이 필요해서 받는거. 
      let width = 1;
      let height = 1;
      if(req.body.width !==0) width = req.body.width;
      if(req.body.height !==0) height = req.body.height;
      let data = {
        myrecipe_title : req.body.title,
        myrecipe_text : req.body.content,
        myrecipe_image_url : imageUrl,
        myrecipe_count : 0,
        user_email : userEmail,
        myrecipe_post_time : moment().format('YYYYMMDDhhmmss'),
        myrecipe_image_w : width,
        myrecipe_image_h : height
      };
      connection.query(registQuery, data, function(err){
        if(err){
          res.status(501).send({
            msg : "Regist content err"
          });
          connection.release();
          callback("Regist content err : "+ err, null);
        }
        else{
          res.status(201).send({
            msg : "Success"
          });
          connection.release();
          callback(null, "Successful writing my recipe");
        }
      });
    }
  ];
  async.waterfall(task_array, function(err, result) {
    if (err){
      err = moment().format('MM/DDahh:mm:ss//') + err;
      console.log(err);
    }
    else{
      result = moment().format('MM/DDahh:mm:ss//') + result;
      console.log(result);
    }
  });
});














