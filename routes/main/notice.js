/*
 default module
*/
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const router = express.Router();
const moment = require('moment'); //시간형식 관리용 모듈
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
    try{
        var pageNumber = req.query.pageNumber;
        var result = await getNoticeList();
        var sessionValue = req.session.user_id;
        console.log(" [ get / in notice.js]  result.length :  " + result.length );
        console.log(" [ get / in notice.js]  pageNumber :  " + pageNumber );

        res.render('notification', {result: result, pageNumber : pageNumber,sessionValue : sessionValue});        

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
            var firstQuery = "select * from notice_BBS where seq = ?";
            var secondQuery = "UPDATE notice_BBS set view = ? where seq = ?";

            var firstExec = connection.query(firstQuery, [seq], function(err, rows) {
                    var tmpViewCnt = rows[0].view + 1 ;
                    console.log(" [ get /noticeBoard in notice.js]  tmpViewCnt :  " + tmpViewCnt );
                    var secondExec = connection.query(secondQuery, [tmpViewCnt, seq], function(err, rows) {
                    });        
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
            res.redirect('/nav/notice/?pageNumber=1');
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
            res.render('noticeEditBoard',{result : rows});
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
            var year = moment().format('YYYY');
            var month = moment().format('MM');
            var day = moment().format('DD');
            var date = year + "-" + month + "-" + day;
            console.log(" [ post /noticeInsertBoard in notice.js]  Date :  " + date );

            var query = "INSERT INTO `notice_BBS` (`title`, `contents`, `date`, `view`) VALUES (?, ?, ?, 0)";
            var exec = connection.query(query, [title, contents, date], function(err, rows) {
            connection.release();  // 반드시 해제해야 합니다.
            res.redirect('/nav/notice/?pageNumber=1');
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
            var year = moment().format('YYYY');
            var month = moment().format('MM');
            var day = moment().format('DD');
            var date = year + "-" + month + "-" + day;

            console.log(" [ post /noticeEditBoard in notice.js]  Date :  " + date );

            var exec = connection.query("UPDATE notice_BBS SET title = ?, contents = ?, date = ? where seq = ?", [title, contents, date , seq], function(err, rows) {
            connection.release();  // 반드시 해제해야 합니다.
            res.redirect('/nav/notice/?pageNumber=1');
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
            var year = moment().format('YYYY');
            var month = moment().format('MM');
            var day = moment().format('DD');
            var date = year + "-" + month + "-" + day;

            console.log(" [in notice.js]  Date :  " + date );
              /*
              Date 추가해주자 
              View Cnt 추가해주자
              */ 
            var exec = connection.query("UPDATE notice_BBS SET title = ?, contents = ?, date = ? where seq = ?", [title, contents, date , seq], function(err, rows) {
            connection.release();  // 반드시 해제해야 합니다.
            res.redirect('/nav/notice/?pageNumber=1');
        });        
    }})
})


module.exports = router;
