'use strict'
const hasPermissionMW = require('../middlewares/hasPermission')
const constants = require('../config/constants')

module.exports = function (app) {
  let user = require('../controllers/userController')

  app.route('/user/register')
    .get(user.register)
    .post(user.create_user)

  app.route('/user/login')
    .get(user.render_login)
    .post(user.login)

  app.route('/user/list')
    .get(hasPermissionMW(constants.ROLE_BOSS), user.list_users)

  app.route('/user/logout')
    .get(user.logout)

  app.route('/user/edit/:id')
    .get(hasPermissionMW(constants.ROLE_BOSS), user.edit_form)
    .post(hasPermissionMW(constants.ROLE_BOSS), user.edit)

  app.route('/user/delete/:id')
    .get(hasPermissionMW(constants.ROLE_BOSS), user.delete)

  app.route('/user/forgot')
    .get(user.forgot_form)
    .post(user.forgot)

  app.route('/user/reset/:token')
    .get(user.reset)
    .post(user.do_reset)
}
