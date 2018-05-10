'use strict'

const mongoose = require('mongoose'),
  User = mongoose.model('Users')

exports.list_users = (req, res) => {
  User.find({}, (err, user) => {
    if (err) {
      res.send(err)
    }
    res.render('home', {
      users: user
    })
  })
}


exports.create_user = (req, res) => {
  let new_user = new User(req.body)
  new_user.save((err, user) => {
    if (err)
      res.send(err)
    res.json(user)
  })
}
