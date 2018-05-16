'use strict'

const mongoose = require('mongoose')
const User = mongoose.model('Users')
const { hashPassword } = require('../models/utils')
const { getDefaultRenderObject } = require('../models/utils')
const async = require('async')
const sgMail = require('@sendgrid/mail')
const crypto = require('crypto')

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
      req.session.user = user
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
    return res.redirect('/user/list')
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

exports.forgot_form = (req, res) => {
  if (req.session.user) {
    return res.redirect('/home')
  }
  return res.render('forgot', getDefaultRenderObject(req, res))
}

exports.forgot = (req, res) => {
  async.waterfall([
    done => {
      crypto.randomBytes(20, function(err, buf) {
        let token = buf.toString('hex')
        done(err, token)
      })
    },
    (token, done) => {
      User.findOneAndUpdate({ email: req.body.email }, {
        $set: {
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 48 * 3600 * 1000
        }
      }, {
        new: true
      }, (err, user) => {
        if (err) {
          return res.status(500).render('forgot', {error: err})
        }
        done(err, token, user)
      })
    },
    (token, user, done) => {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      let msg = {
        to: user.email,
        from: 'noreply@worksheet.com',
        subject: 'Elfelejtett jelszó',
        html: '<strong>Itt igényelhetsz új jelszót:</strong><a href="http://'+req.headers.host+'/user/reset/'+token+'">Új jelszó kérése</a>'
      }
      sgMail.send(msg).then(() => {done()}).catch(err => {done(err)})
    }
  ], err => {
    if (err) {
      return res.status(500).render('forgot', {error: err})
    }
    return res.redirect('/user/forgot')
  })
}

exports.reset = (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (!user) {
      return res.render('reset', {error: 'A megadott URL nem érvényes!'})
    }
    return res.render('reset', {user:   user})
  })
}

exports.do_reset = (req, res) => {
  async.waterfall([
    done => {
      User.findOneAndUpdate({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now()}
        },
        {
        $set: {
          resetPasswordToken: undefined,
          resetPasswordExpires: undefined,
          password: hashPassword(req.body.password)
        }
      }, {
        new: true
      }, (err, user) => {
        if (!user) {
          return res.render('reset', {error: 'A megadott URL nem érvényes!'})
        }
        done(err, user)
      })
    },
    (user, done) => {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      let msg = {
        to: user.email,
        from: 'noreply@worksheet.com',
        subject: 'Sikeres jelszóváltoztatás',
        html: 'A jelszó sikeresen megváltozott.'
      }
      sgMail.send(msg).then(() => {done()}).catch(err => {done(err)})
    }
  ], err => {
    if (err) {
      res.status(500).render('reset', {error: err})
    }
    res.redirect('/home')
  })
}
