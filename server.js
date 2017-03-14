var express = require('express')
var bodyParser = require('body-parser')
var morgan  = require('morgan')

var app = express()
app.use(bodyParser.json())
app.use(morgan('combined'))

app.use(require('./controllers'))

var port = process.env.PORT || 3000
app.listen(port, function() {
  console.log('Set server listening on port ', port)
})
