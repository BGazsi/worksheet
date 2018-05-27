'use strict'
const hasPermissionMW = require('../middlewares/hasPermission')
const constants = require('../config/constants')

module.exports = function (app) {
  let home = require('../controllers/homeController')

  // todoList Routes
  app.route('/')
    .get(hasPermissionMW(constants.ROLE_USER), home.render_home)
}
