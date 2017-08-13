var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

// custom module
var routes = require('./routes/routes');

// app.set
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// app.use
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log("res.locals.message error : " + res.locals.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log("res.locals.error error : " + res.locals.error);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

