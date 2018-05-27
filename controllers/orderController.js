'use strict'

const mongoose = require('mongoose')
const Order = mongoose.model('Orders')
const constants = require('../config/constants')
const OrderItem = mongoose.model('OrderItems')
const { getDefaultRenderObject } = require('../models/utils')
const cloudinary = require('cloudinary')
const async = require('async')

const createNewOrderObject = req => {
  let newOrderObject = req.body
  newOrderObject.createdDate = new Date()
  newOrderObject.status = 1
  newOrderObject.deadline = new Date(req.body.deadline)
  newOrderObject.user = req.session.user._id
  newOrderObject.sampleNeeded = !!req.body.sampleNeeded
  newOrderObject.scrapReplacementNeeded = !!req.body.scrapReplacementNeeded
  newOrderObject.orderItemIds = []
  return newOrderObject
}

const saveNewOrder = (req, res, newOrderObject) => {
  let newOrder = new Order(newOrderObject)
  newOrder.save((err) => {
    if (err) {
      return res.render('newOrder', {
        error: err,
        user: req.session.user
      })
    }
    return res.redirect('/order/list')
  })
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL.split('@')[1],
  api_key: process.env.CLOUDINARY_URL.split(':')[1].slice(2),
  api_secret: process.env.CLOUDINARY_URL.split(':')[2].split('@')[0]
})
exports.render_new_order = (req, res) => {
  return res.render('newOrder', getDefaultRenderObject(req, res))
}

exports.create_order = (req, res) => {
  async.waterfall([
    done => {
      let newOrderObject = createNewOrderObject(req)
      done('', newOrderObject)
    },
    (newOrderObject, done) => {
      req.body.orderItems.forEach((orderItem, index) => {
        let files = req.files['orderItems[' + index + '][pictures]']
        let resArray = []
        orderItem.pictures = []
        if (!(files instanceof Array)) {
          files = [files]
        }
        files.forEach((image) => {
          cloudinary.uploader.upload(image.file, (result) => {
            resArray.push(result)
            orderItem.pictures.push(result.secure_url)
            if (files.length === resArray.length) {
              done('', newOrderObject, orderItem)
            }
          })
        })
      })
    },
    (newOrderObject, orderItem, done) => {
      orderItem = new OrderItem(orderItem)
      orderItem.save((err, item) => {
        if (err) {
          console.error(err)
        }
        return item._id
      })
      newOrderObject.orderItemIds.push(orderItem._id)
      done('', newOrderObject)
    },
    (newOrderObject) => {
      return saveNewOrder(req, res, newOrderObject)
    }
  ])
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
        orders: result,
        user: req.session.user
      })
    })
  }
  Order.find({}, (err, result) => {
    if (err) {
      res.send(err)
    }
    res.render('orderList', {
      orders: result,
      user: req.session.user
    })
  })
}
