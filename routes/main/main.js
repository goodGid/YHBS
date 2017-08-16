/*
 default module
*/
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var router = express.Router();

/*
 custom module
*/
var db_config = require('../../config/db_config.json');



/*
 router.use
*/
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

/*
 Method : Get
*/

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
function getImgList(){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err) reject(err);
            else {
                connection.query("select * from img_BBS where category='etc'", function(err, rows){
                    connection.release();
                    if(err) reject(err);
                    else resolve(rows);
                });
            }
        });
    });
}

router.get('/', async function(req,res){
    
    try{
        var result = await getNoticeList();
        var imgList = await getImgList();
        res.render('index', {result: result, imgList : imgList});        
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }
    
});


router.get('/login',function(req,res){
    res.render('login');
});

router.get('/logout', function(req, res)
{
       var session = req.session;
       if(session.user_id)
       {
           req.session.destroy(function(err)
           {
               if(err)
               {
                   console.log(" Error /logout in main.js  : " + err);
               }else
               {
                    res.redirect('/');
               }
           })
       }
       else
       {
          console.log("Session destroy");
          res.redirect('/');
       }
   })
   
/*
 Method : Post
*/
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

            if (rows.length != 0) {
                console.log('아이디 [%s], 패스워드 [%s] 가 일치하는 사용자 찾음.', user_id, password);
                req.session.user_id = user_id;
                res.redirect('/');
            } else {
            	console.log("일치하는 사용자를 찾지 못함.");
                res.redirect('login');
            }
        });        
    }})
});

module.exports = router;
