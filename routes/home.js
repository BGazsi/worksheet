'use strict'
const renderTemplateMW = require('../middlewares/renderTemplate')
module.exports = function(app) {
  let user = require('../controllers/userController')

  // todoList Routes
  app.route('/')
    .get(user.list_users)

  app.route('/user/create')
    .post(user.create_user)


}
