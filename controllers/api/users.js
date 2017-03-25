var router = require('express').Router()
var jwt = require('jwt-simple')
var config = require('../../config')

// get the logged-in user
router.get('/', function(req, res, next) {
  if (!req.headers['x-auth']) {
    return res.sendStatus(401)
  }
  var auth = jwt.decode(req.headers['x-auth'], config.secret)
  res.json({username: auth.username})
})

module.exports = router
