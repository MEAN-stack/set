var router = require('express').Router()
var jwt = require('jwt-simple')
var config = require('../../config')

var games = []

// return a collection of games
router.get('/', function(req, res, next) {
  res.json(games)
})

router.post('/', function(req, res, next) {
  if (!req.headers['x-auth']) {
    return res.sendStatus(401)
  }
  var auth = jwt.decode(req.headers['x-auth'], config.secret)
  games.push({creator: auth.username, players: [auth.username]})
  res.sendStatus(201)
})

module.exports = router
