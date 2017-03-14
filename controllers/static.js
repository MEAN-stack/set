var express = require('express')
var router = express.Router()
var path = require('path')

router.get('/', function(req, res) {
  res.sendfile(path.resolve(__dirname + '/../layouts/app.html'))
})

router.use(express.static(__dirname + '/..'))
router.use(express.static(__dirname + '/../assets'))
router.use(express.static(__dirname + '/../templates'))

module.exports = router
