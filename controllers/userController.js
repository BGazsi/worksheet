'use strict'

const mongoose = require('mongoose'),
  User = mongoose.model('Users')
const { hashPassword } = require('../models/utils')
const { getDefaultRenderObject } = require('../models/utils')

exports.render_login = (req, res) => {
  if (req.session && req.session.user) {
    res.redirect('/home')
  }
  res.render('login')
}

exports.login = (req, res) => {
  res.render('login')
}

exports.create_user = (req, res) => {
  let newUserObject = req.body
  newUserObject.password = hashPassword(newUserObject.password)
  newUserObject.role = 'user'
  newUserObject.enabled = true
  newUserObject.created_date = new Date()
  let new_user = new User(newUserObject)
  new_user.save((err, user) => {
    if (err) {
      res.render('register', {error: err})
      return
    }
    res.tpl.newUser = user
    res.redirect('login')
  })
}

exports.register = (req, res) => {
  if (req.session && req.session.user) {
    res.redirect('/home')
  }
  res.render('register', getDefaultRenderObject())
}

exports.list_users = (req, res) => {
  User.find({}, (err, result) => {
    if (err) {
      res.send(err)
    }
    res.render('userList', {
      users: result
    })
  })
}
