'use strict'
const hasPermissionMW = require('../middlewares/hasPermission')
const constants = require('../config/constants')

module.exports = function (app) {
  let order = require('../controllers/orderController')

  app.route('/order/create')
    .get(hasPermissionMW(constants.ROLE_USER), order.render_new_order)
    .post(hasPermissionMW(constants.ROLE_USER), order.create_order)

  app.route('/order/list')
    .get(hasPermissionMW(constants.ROLE_USER), order.list_orders)
}
