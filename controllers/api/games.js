var router = require('express').Router()
var jwt = require('jwt-simple')
var config = require('../../config')
var ws = require('../../websockets')

var games = []

nextId = 1234

// return a collection of games
router.get('/', function(req, res, next) {
  res.json(games)
})

router.post('/', function(req, res, next) {
  if (!req.headers['x-auth']) {
    return res.sendStatus(401)
  }
  var auth = jwt.decode(req.headers['x-auth'], config.secret)
  var username = auth.username
  
  for (var i=0; i<games.length; i++) {
    if (games[i].creator==username) {
      return res.sendStatus(409)
    }
  }
  games.push({id: nextId, creator: username, players: [username]})
  ws.broadcast('newgame', {id: nextId, creator: username, players: [username]})
  nextId++
  res.sendStatus(201)
})

router.post('/:id/players', function(req, res, next) {
  if (!req.headers['x-auth']) {
    return res.sendStatus(401)
  }
  var auth = jwt.decode(req.headers['x-auth'], config.secret)
  var username = auth.username
  var gameId = req.params.id
  var i

  for (i=0; i<games.length; i++) {
    if (games[i].id==gameId) {
      game=games[i]
      break
    }
  }

  for (i=0; i<game.players.length; i++) {
    if (game.players[i]==username) {
      return res.sendStatus(409)
    }
  }
  game.players.push(username)
  ws.broadcast('newplayer', {gameid: game.id, player: username})
  res.sendStatus(201)
})

module.exports = router
