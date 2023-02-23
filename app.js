var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
var hbs = require('hbs');
var i18n = require('i18n');
hbs.registerPartials(__dirname + '/views', function (err) {});
hbs.registerPartials(__dirname + '/views/layouts', function (err) {});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

//i18n config
i18n.configure({
    locales:['en', 'zh-CN'],
    directory: __dirname + '/public/languages',
    defaultLocale: 'en'
});
hbs.registerHelper('__', function () {
    return i18n.__.apply(this, arguments);
});
hbs.registerHelper('__n', function () {
    return i18n.__n.apply(this, arguments);
});
app.use(i18n.init);
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'sdfddgsadffgegasdfghrjljllihhjykhf'
}));
app.use(setLocale);
function setLocale(req, res, next){
    var locale;
    if(req.acceptsLanguages()){
        locale = req.acceptsLanguages();
    }
    else{
        locale = 'en';
    }
    req.setLocale(locale);
    console.log(locale);
    next();
};


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
