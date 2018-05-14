'use strict'

const mongoose = require('mongoose'),
  User = mongoose.model('Users')
const { hashPassword } = require('../models/utils')
const { getDefaultRenderObject } = require('../models/utils')

exports.render_login = (req, res) => {
  if (req.session && req.session.user) {
    res.redirect('/home')
  }
  res.render('login', getDefaultRenderObject(req, res))
}

exports.login = (req, res) => {
  if (req.session && req.session.user) {
    res.redirect('/home')
  }
  User.findOne({
    email: req.body.username
  }, (err, user) => {
    if (err) {
      res.render('login', {error: err})
      return
    }
    if (user && user.isSamePassword(req.body.password)) {
      req.session.user = user;
      res.redirect('/home')
    } else if (user) {
      res.render('login', {error: 'Nem megfelelő jelszó'})
    } else {
      res.render('login', {error: 'Nem megfelelő felhasználónév'})
    }
  })
}

exports.create_user = (req, res) => {
  let newUserObject = req.body
  newUserObject.password = hashPassword(newUserObject.password)
  newUserObject.role = 10
  newUserObject.enabled = true
  newUserObject.created_date = new Date()
  let new_user = new User(newUserObject)
  new_user.save((err, user) => {
    if (err) {
      res.render('register', {error: err})
      return
    }
    res.redirect('login')
  })
}

exports.register = (req, res) => {
  if (req.session && req.session.user) {
    res.redirect('/home')
  }
  res.render('register', getDefaultRenderObject(req, res))
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

exports.logout = (req, res) => {
  delete req.session.user
  res.redirect('/')
}

exports.delete = (req, res) => {
  User.findOneAndRemove({
    _id: req.params['id']
  }, (err, user) => {
    if (err) {
      return res.status(500).send(err)
    }
    return res.status(200).send({removedUser: user})
  })
}

exports.edit_form = (req, res) => {
  User.findOne({
    _id: req.params['id']
  }, (err, user) => {
    if (err) {
      return res.status(500).send(err)
    }
    return res.render('userEdit', {
      user: req.session.user,
      editUser: user
    })
  })
}

exports.edit = (req, res) => {
  User.findOneAndUpdate({
    _id: req.params['id']
  }, {
    $set: {
      name: req.body.name,
      email: req.body.email,
      company: req.body.company,
      phone: req.body.phone,
      role: req.body.role
    }
  }, {
    runValidators: true,
    new: true
  }, (err, user) => {
    if (err) {
      return res.status(500).send(err)
    }
    return res.redirect('/user/list')
  })
}
