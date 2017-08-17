/*
 default module
*/
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var router = express.Router();
const moment = require('moment'); //시간형식 관리용 모듈
var aws=require('aws-sdk');
var multer=require('multer');
var multerS3=require('multer-s3');
/*
 custom module
*/
var db_config = require('../../config/db_config.json');
var notification = require('./notice');

/*
 router.use
*/
router.use('/notice',notification);

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

/*
 Function Sector
*/

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

function getThumbnailEdit(category, seq){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err) reject(err);
            else {
                connection.query("select * from img_BBS where category = ? and seq = ? ", [category, seq], function(err, rows){


                    connection.release();
                    if(err) reject(err);
                    else resolve(rows);
                });
            }
        });
    });
}

function insertThumbnail(category, seq){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err) reject(err);
            else {
                connection.query('insert from img_bbs where category = ? and seq = ?', [category, seq], function(err, rows){
                    connection.release();
                    if(err) reject(err);
                    else resolve(rows);
                });
            }
        });
    });
}

function deleteThumbnail(category, seq){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err) reject(err);
            else {
                connection.query('delete from img_BBS where category = ? and seq = ?', [category, seq], function(err, rows){
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


/*
 Method : Get
*/
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

router.get('/grade', async function(req, res){
    try{
        var imageList = await getThumbnailList("grade");
        var pageNumber = req.query.pageNumber;

        res.render('grade', {imgList: imageList,pageNumber : pageNumber});        
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }
});

router.get('/introduce',function(req,res){
        res.render('introduce');
});

router.get('/greetings',function(req,res){
        res.render('greetings');
});

router.get('/location',function(req,res){
    res.render('location');
});

router.get('/policy',function(req,res){
    res.render('policy');
});

router.get('/uniform',function(req,res){
    res.render('uniform');
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

router.get('/grade', async function(req, res){
    try{
        var imageList = await getThumbnailList("grade");
        res.render('grade', {imgList: imageList});        
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }
});

router.get('/nursery',async function(req,res){
    try{
        var imageList = await getThumbnailList("nursery");
        res.render('nursery', {imgList: imageList});        
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }
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
        var pageNumber = req.query.pageNumber;
        var sessionValue = req.session.user_id;

        res.render('etc', {imgList: imageList, pageNumber : pageNumber, sessionValue : sessionValue});        
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }
});

router.get('/etcBoard/:seq', async function(req,res){
    try{
        var seq = req.params.seq;
        var imageList = await getThumbnailEdit("etc", seq);
        var pageNumber = req.query.pageNumber;
        var sessionValue = req.session.user_id;
    
        res.render('etcBoard', {result: imageList, sessionValue : sessionValue, pageNumber : pageNumber});   
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }    
});

router.get('/etcEditBoard/:seq', async function(req,res){
    try{
        var seq = req.params.seq;
        var pageNumber = req.query.pageNumber;
        var imageList = await getThumbnailEdit("etc", seq);
        res.render('etcEditBoard', {result: imageList, seq : seq , pageNumber : pageNumber});   
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }    
});


router.get('/etcInsertBoard', function(req,res){
    res.render('etcInsertBoard');
});    



router.get('/etcDelete/:seq', async function(req,res){
    try{
        var seq = req.params.seq;
        var pageNumber = req.query.pageNumber;
        var deleteImg = await deleteThumbnail("etc", seq);
        res.redirect('/nav/etc/?pageNumber='+pageNumber);   
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }    
});


router.post('/etcInsertBoard',upload.single('pic'), async function(req, res){
    var imageList =  await getThumbnailList("etc");
    var imgUrlFromS3 = req.file.location;
    
    var title = req.body.title;
    var contents = req.body.contents;
    var sessionValue = req.session.user_id;
    pool.getConnection(function(error, connection)
    {
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

        var query = "INSERT INTO `img_BBS` (`imgUrl`,`category`, `date`, `title`, `contents`) VALUES (?, ?, ?, ?, ?)";
        var exec = connection.query(query, [imgUrlFromS3, "etc", date, title, contents], function(err, rows) {
        connection.release();  // 반드시 해제해야 합니다.
        res.render('etc', {imgList: imageList,sessionValue : sessionValue, pageNumber : "1"});
             });        
        }
    });
});

router.post('/etcEditBoard/:seq',upload.single('pic'), async function(req, res){
    var imageList =  await getThumbnailList("etc");
    var imgUrlFromS3 = req.file.location;
    
    var seq = req.params.seq;
    var title = req.body.title;
    var contents = req.body.contents;
    var sessionValue = req.session.user_id;
    var pageNumber = req.query.pageNumber;

    pool.getConnection(function(error, connection)
    {
        if(error)
        {
          console.log("database error");
          res.status(503).send({result:"fail"});
          connection.release();
        }
        else
        {
        var query = "UPDATE img_BBS set imgUrl = ?, title = ?, contents = ? where seq = ?";
        var exec = connection.query(query, [imgUrlFromS3, title, contents, seq], function(err, rows) {
        connection.release();  // 반드시 해제해야 합니다.
        res.redirect('/nav/etc/?pageNumber='+pageNumber);
             });        
        }
    });
});






module.exports = router;


// console.log(" [ post /editInsertBoard in navigation.js]  imageList.length :  " + imageList.length );
