var Room = require('../cards')
var router = require('express').Router()

// return a collection of rooms
router.get('/', function(req, res, next) {
  var cards = new Cards()
  res.json(cards)
})

module.exports = router
