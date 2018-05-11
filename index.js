const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  User = require('./models/users'),
  bodyParser = require('body-parser'),
  session = require('express-session');

require('dotenv').config()
mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_HOST)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('view engine', 'ejs')

app.use(session({
  name : 'sessionID',
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

const routeHome = require('./routes/home')
const routeUser = require('./routes/user')

routeHome(app)
routeUser(app)

app.use((req, res) => {
  res.status(404).send({url: req.originalUrl + ' not found'})
})

app.listen(port)

console.log('Server started on port ' + port)
