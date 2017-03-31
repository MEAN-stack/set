var Deck = require('../../deck')
var shuffle = require('lodash.shuffle')
var router = require('express').Router()

// return a collection of rooms
router.get('/', function(req, res, next) {
  var deck = new Deck().cards
  res.json(shuffle(deck))
})

module.exports = router
