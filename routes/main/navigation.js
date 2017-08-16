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
/* insert 구현 해줘야 함 */
function insertThumbnail(category, seq){
    return new Promise(function(resolve, reject){
        pool.getConnection(function(err, connection){
            if(err) reject(err);
            else {
                connection.query('delete from img_bbs where category = ? and seq = ?', [category, seq], function(err, rows){
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
                connection.query('delete from img_bbs where category = ? and seq = ?', [category, seq], function(err, rows){
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

        console.log(" [in navigation.js]  imageList.length :  " + imageList.length );
        console.log(" [in navigation.js]  pageNumber :  " + pageNumber );

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

        console.log(" [in navigation.js]  imageList.length :  " + imageList.length );
        console.log(" [in navigation.js]  pageNumber :  " + pageNumber );

        res.render('etc', {imgList: imageList, pageNumber : pageNumber});        
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }
});

router.get('/etcBoard/:seq', async function(req,res){
    try{
        var seq = req.params.seq;
        var imageList = await getThumbnailEdit("etc", seq);
        res.render('etcBoard', {result: imageList});   
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }    
});

router.get('/etcEditBoard/:seq', async function(req,res){
    try{
        var seq = req.params.seq;
        var imageList = await getThumbnailEdit("etc", seq);
        res.render('etcEditBoard', {result: imageList});   
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }    
});

//post 방식으로 etcEditBoard 구현해야함.
//insert 구현가능해
router.get('/etcInsertBoard', async function(req,res){
    try{
        var insertImg = await insertThumbnail("etc", seq);
        res.redirect('/nav/etc');   
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }    
});

router.get('/etcDelete/:seq', async function(req,res){
    try{
        var seq = req.params.seq;
        var deleteImg = await deleteThumbnail("etc", seq);
        res.redirect('/nav/etc/?pageNumber=1');   
    }catch(err){
        console.log(err);
        res.status(503).send({result: "fail"});
    }    
});

module.exports = router;
