var router = require('express').Router()

var games = [
  {creator: 'David', players: ['David']},
  {creator: 'Someone', players: []}
]

// return a collection of games
router.get('/', function(req, res, next) {
  res.json(games)
})

router.post('/', function(req, res, next) {
  games.push({creator: 'Paul', players: ['Paul', 'Santhosh', 'Manasa']})
  res.status(201).send(token)
})

module.exports = router
