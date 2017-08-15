/*
 default module
*/
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const router = express.Router();

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
 Function Sector
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

/*
 Method : Get
*/

router.get('/', async function(req,res){
    
    try{
        var result = await getNoticeList();
        res.render('notification', {result: result});        
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }
    
});

router.get('/noticeBoard', function(req,res){
    res.render('noticeBoard');
});

router.get('/noticeInsertBoard',function(req,res){
    res.render('noticeInsertBoard');
})


/*
 Method : Post
*/

router.post('/noticeInsertBoard',function(req,res){
      pool.getConnection(function(error, connection)
      {
          var title = req.body.title;
          var contents = req.body.contents;
          if(error)
          {
            console.log("database error");
            res.status(503).send({result:"fail"});
            connection.release();
          }
          else
          {
            var exec = connection.query("INSERT INTO yhbs.notice_BBS (`title`, `contents`, `date`, `viewCnt`) VALUES (?, ?, '4', '4')", [title, contents], function(err, rows) {
            connection.release();  // 반드시 해제해야 합니다.

            res.redirect('/nav/notice');
        });        
    }})
})

module.exports = router;
