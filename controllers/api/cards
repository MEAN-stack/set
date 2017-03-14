var Room = require('../../models/room')
var router = require('express').Router()

// return a collection of rooms
router.get('/', function(req, res, next) {
  Room.find(function(err, rooms) {
    if (err) {
      return (next(err))
    }
    else {
      res.json(rooms)
    }
  })
})

// create a new room
router.post('/', function(req, res, next) {
  var room = new Room({
    roomname: req.body.roomname,
    topic: req.body.topic,
    members: req.body.members 
  })
  room.save(function(err, room) {
    if (err) {
      console.log('Error creating room: '+err.message)
      res.sendStatus(400)
    }
    else {
      res.status(201).json(room)
    }
  })
})

// return details for a given room
router.get('/:roomname', function(req, res, next) {
  Room.findOne({roomname: req.params.roomname}, function(err, room) {
    if (err) {
      return (next(err))
    }
    else {
      if (room) {
        res.json(room)
      }
      else {
        res.sendStatus(404)
      }
    }
  })
})

// return a collection of members for a given room
router.get('/:roomname/members', function(req, res, next) {
  Room.findOne({roomname: req.params.roomname}, function(err, room) {
    if (err) {
      return (next(err))
    }
    else {
      if (room) {
        res.json(room.members)
      }
      else {
        res.sendStatus(404)
      }
    }
  })
})

// add a member to a room
router.post('/:roomname/members', function(req, res, next) {
  if (!req.body.name) {
    res.sendStatus(400)
  }
  else {
    var member = { name: req.body.name }
    Room.findOneAndUpdate({roomname: req.params.roomname}, {$push: {members: member.name}}, {returnNewDocument: true}, function(err, room) {
      if (err) {
        return(next(err))
      }
      else {
        res.status(201).json(room)
      }
    })
  }
})

module.exports = router
