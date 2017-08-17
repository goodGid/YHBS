/*
 default module
*/
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');

/*
 custom module
*/
var routes = require('./routes/routes');

/*
 app.set
*/
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


/*
 app.use
*/
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session(
  {
    secret: 'yhbschool', //세션을 암호화 하여 저장
    resave: false,// 세션을 언제나 저장할지 결정
    saveUninitialized: true, // 세션이 저장되기 전에 saveUninitialized 상태로 저장
    cookie: { secure: !true }    
  }));


app.use('/',routes);


app.use(function(req, res, next)
{
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next)
{
  res.locals.message = err.message;
  // console.log("res.locals.message error : " + res.locals.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // console.log("res.locals.error error : " + res.locals.error);

  res.status(err.status || 500);
  res.render('error',{errLog : res.locals.error});
});

module.exports = app;

