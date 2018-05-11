'use strict'
const hasPermissionMW = require('../middlewares/hasPermission')
const constants = require('../config/constants');

module.exports = function(app) {
  let user = require('../controllers/userController')
  let home = require('../controllers/homeController')

  // todoList Routes
  app.route('/')
    .get(hasPermissionMW(constants.ROLE_USER), user.list_users)

  app.route('/user/create')
    .post(user.create_user)

  app.route('/home')
    .get(user.list_users)

  app.route('/login')
    .get(home.login)
}
