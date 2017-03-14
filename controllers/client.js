/*
  This is the browser's entry point
  The browser must request /client?user=p4w&password=recycle
  All being well we return the initial html page
*/
var router = require('express').Router()

router.get('*', function(req, res, next) {
  res.sendfile('layouts/app.html')
})

module.exports = router

