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
                connection.query("select * from notice_BBS", function(err, rows){
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

router.get('/' , async function(req,res){
    console.log(" [in notice.js]    here");
    try{
        var pageNumber = req.query.pageNumber;
        var result = await getNoticeList();
        console.log(" [in notice.js]  result.length :  " + result.length );
        console.log(" [in notice.js]  pageNumber :  " + pageNumber );

        res.render('notification', {result: result, pageNumber : pageNumber});        

    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }
});

router.get('/noticeBoard/:seq', function(req,res){
     pool.getConnection(function(error, connection)
      {
          var seq = req.params.seq;
          if(error)
          {
            console.log("database error");
            res.status(503).send({result:"fail"});
            connection.release();
          }
          else
          {
            var exec = connection.query("select * from notice_BBS where seq = ?", [seq], function(err, rows) {
            connection.release();  // 반드시 해제해야 합니다.
            res.render('noticeBoard', {result : rows });
        });        
    }})
});

router.get('/noticeInsertBoard',function(req,res){
    res.render('noticeInsertBoard');
})


router.get('/noticeDelete/:seq',function(req,res){
    pool.getConnection(function(error, connection)
      {
          var seq = req.params.seq;
          if(error)
          {
            console.log("database error");
            res.status(503).send({result:"fail"});
            connection.release();
          }
          else
          {
            var exec = connection.query("delete from notice_BBS where seq = ?", [seq], function(err, rows) {
            connection.release();  // 반드시 해제해야 합니다.
            res.redirect('/nav/notice');
        });        
    }})
})

router.get('/noticeEdit/:seq',function(req,res){
    pool.getConnection(function(error, connection)
      {
          var seq = req.params.seq;
          if(error)
          {
            console.log("database error");
            res.status(503).send({result:"fail"});
            connection.release();
          }
          else
          {
            var exec = connection.query("select * from notice_BBS where seq = ?", [seq], function(err, rows) {
            connection.release();  // 반드시 해제해야 합니다.
            res.render('noticeEditBoard', {result : rows});
        });        
    }})
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


router.post('/noticeEditBoard/:seq',function(req,res){
    pool.getConnection(function(error, connection)
      {
          var seq = req.params.seq;
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
            var exec = connection.query("UPDATE notice_BBS SET title = ?, contents = ? where seq = ?", [title, contents, seq], function(err, rows) {
            connection.release();  // 반드시 해제해야 합니다.
            res.redirect('/nav/notice/?pageNumber=1');
        });        
    }})
})






















module.exports = router;
