var router = require('express').Router()
var jwt = require('jwt-simple')
var config = require('../../config')
var ws = require('../../websockets')
var Cards = require('../../cards')
var shuffle = require('lodash.shuffle')

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
    return res.sendStatus(404)
  }
  console.dir(game)
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
// the auth user must be the owner of the game
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
  if (game.owner !== username) {
    return res.sendStatus(401)
  }
  if (req.body.status) {
    game.status = req.body.status
    if (status==="complete") {
      deleteGame(req.params.id)
    }
  }
})

// find game with given id
//
function findGame(id) {
  for (var i=0; i<games.length; i++) {
    if (games[i].id===id) {
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
