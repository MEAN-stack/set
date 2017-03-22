/*
  We define our Express routes here
*/
var router = require('express').Router()
var bodyParser = require('body-parser')

/*
  Any requests with a JSON body will be parsed here...
*/
router.use(bodyParser.json())

/*
  ...the parsed body is now available in req.body
*/

/*
  Other endpoints
*/
router.use('/client', require('./client'))
router.use('/api/cards', require('./api/cards'))
router.use('/api/users', require('./api/users'))
router.use('/api/sessions', require('./api/sessions'))
router.use('/api/games', require('./api/games'))

/*
  TODO: test this!
  catch errors here
*/
router.use(function (err, req, res, next) {
  res.status(500).send(err.message)
})

/*
  Serve static assets from the assets folder
*/
router.use('/', require('./static'))

module.exports = router
