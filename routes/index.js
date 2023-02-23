var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/brainstorm', function(req, res, next) {
  res.render('brainstorm');
});

router.get('/pinode', function(req, res, next) {
  res.render('pinode');
});


router.get('/down', function(req, res, next) {
  res.render('down');
});

router.get('/support', function(req, res, next) {
  res.render('support');
});


router.get('/faq', function(req, res, next) {
  res.render('faq');
});

router.get('/undefined', function(req, res, next) {
  res.render('error');
});



router.get('/header-dh', function(req, res, next) {
  res.render('header-dh');
});
router.get('/head', function(req, res, next) {
  res.render('head');
});
router.get('/header', function(req, res, next) {
  res.render('header');
});
router.get('/footer', function(req, res, next) {
  res.render('footer');
});
router.get('/main-nav', function(req, res, next) {
  res.render('main-nav');
});
router.get('/mobile-nav', function(req, res, next) {
  res.render('mobile-nav');
});


module.exports = router;
