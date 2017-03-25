var router = require('express').Router()
var jwt = require('jwt-simple')
var config = require('../../config')
var ws = require('../../websockets')


// var game =  {
//  id: "1234",
//  owner: "paul",
//  status: "waiting/playing/complete"
//}

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
    if (games[i].owner==username) {
      return res.sendStatus(409)
    }
  }
  games.push({id: nextId, owner: username, status: "waiting", players: [username]})
  ws.broadcast('newgame', {id: nextId, owner: username, status: "waiting", players: [username]})
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
  if (i==games.length) {
    return res.sendStatus(404)
  }

  for (i=0; i<game.players.length; i++) {
    if (game.players[i]==username) {
      return res.sendStatus(409)
    }
  }
  game.players.push(username)
  ws.broadcast('newplayer', {gameId: game.id, player: username})
  res.sendStatus(201)
})

// change the status of a game
// the auth user must be the owner of the game
//
router.put('/:id', function(req, res, next) {
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
  if (i==games.length) {
    return res.sendStatus(404)
  }
  if (game.owner != username) {
    return res.sendStatus(401)
  }
  if (req.body.status) {
    game.status = req.body.status
    if (status=="complete") {
      games.splice(i, 1)
    }
  }
})

module.exports = router
