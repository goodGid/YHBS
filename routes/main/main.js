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

router.get('/', function(req,res){
    res.render('index');
});


router.get('/login',function(req,res){
    console.log(' /routes/login in main.js ');
    res.render('login');
});


router.post('/login',function(req, res, next)
{
      pool.getConnection(function(error, connection)
      {
          user_id = req.body.id;
          password = req.body.password;
          if(error)
          {
            console.log("database error");
            res.status(503).send({result:"fail"});
            connection.release();
          }
          else
          {
            var exec = connection.query("select id from users where id = ? and password = ?", [user_id, password], function(err, rows) {
            connection.release();  // 반드시 해제해야 합니다.
            console.log('실행 대상 SQL Length : ' + rows.length);

            if (rows.length != 0) {
                console.log('아이디 [%s], 패스워드 [%s] 가 일치하는 사용자 찾음.', user_id, password);
                res.redirect('/');
            } else {
            	console.log("일치하는 사용자를 찾지 못함.");
                res.redirect('login');
            }
        });        
    }})
});

module.exports = router;
