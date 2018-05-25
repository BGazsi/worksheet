'use strict'

const mongoose = require('mongoose')
const Order = mongoose.model('Orders')
const { getDefaultRenderObject } = require('../models/utils')

exports.render_new_order = (req, res) => {
  return res.render('newOrder', getDefaultRenderObject(req, res))
}

exports.create_order = (req, res) => {
  let newOrderObject = req.body
  newOrderObject.createdDate = new Date()
  newOrderObject.status = 1
  newOrderObject.deadline = new Date(req.body.deadline)
  newOrderObject.sampleNeeded = !!req.body.sampleNeeded
  newOrderObject.scrapReplacementNeeded = !!req.body.scrapReplacementNeeded
  newOrderObject.orderItems = []
  let newOrder = new Order(newOrderObject)
  newOrder.save((err) => {
    if (err) {
      res.render('newOrder', {error: err})
      return
    }
    res.redirect('/home')
  })
}

exports.list_orders = (req, res) => {
  Order.find({}, (err, result) => {
    if (err) {
      res.send(err)
    }
    res.render('orderList', {
      orders: result
    })
  })
}
