var router = require('express').Router()
var jwt = require('jwt-simple')
var config = require('../../config')
var ws = require('../../websockets')
var Cards = require('../../cards')
var shuffle = require('lodash.shuffle')
var _ = require('lodash')

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

// return game details
router.get('/:id', function(req, res, next) {
  console.log('get game with id '+req.params.id)

  var game = findGame(req.params.id)
  if (game) {
    res.json(game)
  }
  else {
    return res.sendStatus(404)
  }
})

// return list of players for a game
router.get('/:/id/players', function(req, res, next) {
  res.json(games[req.params.id].players)
})

router.post('/', function(req, res, next) {
  if (!req.headers['x-auth']) {
    return res.sendStatus(401)
  }
  var auth = jwt.decode(req.headers['x-auth'], config.secret)
  var username = auth.username
  
  for (var i=0; i<games.length; i++) {
    if (games[i].owner===username) {
      return res.sendStatus(409)
    }
  }
  // create a new game
  // create the deck and shuffle it now
  var deck = shuffle(new Cards().cards)

  games.push({id: nextId, owner: username, status: "waiting", players: [username], cards: deck})
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
  var i
  console.log('finding game '+req.params.id)  
  var game = findGame(req.params.id)
  if (!game) {
    console.log('failed to find game '+req.params.id)
    return res.sendStatus(404)
  }
  for (i=0; i<game.players.length; i++) {
    if (game.players[i]===username) {
      return res.sendStatus(409)
    }
  }
  game.players.push(username)
  ws.broadcast('newplayer', {gameId: game.id, player: username})
  res.sendStatus(201)
})

// change the status of a game
// the auth user must be a player of the game
//
router.put('/:id', function(req, res, next) {
  if (!req.headers['x-auth']) {
    return res.sendStatus(401)
  }
  var auth = jwt.decode(req.headers['x-auth'], config.secret)
  var username = auth.username
  
  var game = findGame(req.params.id)
  if (!game) {
    return res.sendStatus(404)
  }

  if (!_.contains(game.players, username)) {
    return res.sendStatus(401)
  }
  if (req.body.status) {
    game.status = req.body.status
    console.log("changing status of game "+game.id+" to "+game.status)
    if (game.status==="playing") {
      ws.broadcast('gameon', {gameId: game.id})
    }
    else if (game.status==="complete") {
//      ws.broadcastToPlayers(game.id, 'gameover', {gameId: game.id})
      deleteGame(req.params.id)
    }
  }
  if (req.body.set) {
    if (checkSet(req.body.set)) {
      ws.broadcast('goodset', {gameId: game.id, set: set})
    }
    else {
      ws.broadcast('badset', {gameId: game.id, set: set})
    }
  }
  if (req.body.deal) {
    ws.broadcast('deal', {gameId: game.id})
  }
  res.sendStatus(200)
})

/**
 * return true if the three cards form a set
 */
var checkSet = function(set) {
  var shape = 0
  var number = 0
  var fill = 0
  var color = 0

  if (set.length != 3) {
    return false
  }
  for (var i=0; i<3; i++) {
    var card = set[i]
    shape += card.shape
    number += card.number
    fill += card.fill
    color += card.color
  }
  shape %= 3
  number %= 3
  fill %= 3
  color %= 3
  return (shape===0 && number===0 && fill===0 && color===0)
}

// find game with given id
//
function findGame(id) {
  for (var i=0; i<games.length; i++) {
    if (games[i].id==id) {
      return games[i]
    }
  }
  return null
}

// delete game with given id
//
function deleteGame(id) {
  for (var i=0; i<games.length; i++) {
    if (games[i].id===id) {
      games.splice(i, 1)
      break
    }
  }
}

module.exports = router
