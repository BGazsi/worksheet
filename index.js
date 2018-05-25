const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const mongoose = require('mongoose')
const User = require('./models/users')
const Order = require('./models/orders')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

require('dotenv').config()
mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_HOST)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('view engine', 'ejs')

app.use(expressLayouts)
app.set('layout', 'layout')

app.use(express.static('public/dist'))

app.use(session({
  name: 'sessionID',
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

const routeHome = require('./routes/home')
const routeUser = require('./routes/user')
const routeOrder = require('./routes/order')

routeHome(app)
routeUser(app)
routeOrder(app)

app.use((req, res) => {
  res.status(404).send({url: req.originalUrl + ' not found'})
})

app.listen(port)

console.log('Server started on port ' + port)
