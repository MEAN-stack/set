var Cards = require('../../cards')
var shuffle = require('lodash.shuffle')
var router = require('express').Router()

// return a collection of rooms
router.get('/', function(req, res, next) {
  var cards = new Cards().cards
  var shuffledCards = shuffle(cards)
  res.json(shuffledCards)
})

module.exports = router
