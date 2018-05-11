const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  User = require('./models/users'),
  bodyParser = require('body-parser')

require('dotenv').config()
mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_HOST)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('view engine', 'ejs')

app.use(function (req, res, next) {

  res.tpl = {}
  res.tpl.error = []

  return next()
})

const routes = require('./routes/home')
routes(app)

app.use((req, res) => {
  res.status(404).send({url: req.originalUrl + ' not found'})
})

app.listen(port)

console.log('Server started on port ' + port)
