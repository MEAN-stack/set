var router = require('express').Router()
var jwt = require('jwt-simple')
var config = require('../../config')

router.post('/', function(req, res, next) {
  try {
    var token = jwt.encode({
      username: req.body.username
    }, config.secret)
    res.status(201).send(token)
  }
  catch (ex) {
    console.log('Caught '+ex.message)
  }
})

module.exports = router
