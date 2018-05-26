'use strict'

const mongoose = require('mongoose')
const Order = mongoose.model('Orders')
const constants = require('../config/constants')
const OrderItem = mongoose.model('OrderItems')
const { getDefaultRenderObject } = require('../models/utils')

exports.render_new_order = (req, res) => {
  return res.render('newOrder', getDefaultRenderObject(req, res))
}

exports.create_order = (req, res) => {
  let newOrderObject = req.body
  newOrderObject.createdDate = new Date()
  newOrderObject.status = 1
  newOrderObject.deadline = new Date(req.body.deadline)
  newOrderObject.user = req.session.user._id
  newOrderObject.sampleNeeded = !!req.body.sampleNeeded
  newOrderObject.scrapReplacementNeeded = !!req.body.scrapReplacementNeeded
  newOrderObject.orderItemIds = createOrderItems(req.body.orderItems || [])
  let newOrder = new Order(newOrderObject)
  newOrder.save((err) => {
    if (err) {
      res.render('newOrder', {error: err})
      return
    }
    res.redirect('/order/list')
  })
}

exports.list_orders = (req, res) => {
  if (req.session.user.role > constants.ROLE_GRAPHIC) {
    Order.find({
      user: req.session.user._id
    }, (err, result) => {
      if (err) {
        res.send(err)
      }
      res.render('orderList', {
        orders: result
      })
    })
  }
  Order.find({}, (err, result) => {
    if (err) {
      res.send(err)
    }
    res.render('orderList', {
      orders: result
    })
  })
}

let createOrderItems = orderItems => {
  return orderItems.map(orderItem => {
    orderItem = new OrderItem(orderItem)
    orderItem.save((err, item) => {
      if (err) {
        console.error(err)
      }
      return item._id
    })
    return orderItem._id
  })
}
