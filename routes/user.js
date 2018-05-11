'use strict'
const hasPermissionMW = require('../middlewares/hasPermission')
const constants = require('../config/constants');

module.exports = function(app) {
  let user = require('../controllers/userController')

  app.route('/user/register')
    .get(user.register)
    .post(user.create_user)

  app.route('/user/login')
    .get(user.render_login)
    .post(user.login)

  app.route('/user/list')
    .get(user.list_users)
}
