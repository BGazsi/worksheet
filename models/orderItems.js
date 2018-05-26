const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderItemSchema = new Schema({
  product: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  numberOfColors: {
    type: String,
    required: true
  },
  pantoneColors: {
    type: String,
    required: true
  },
  placement: {
    type: String,
    required: true
  },
  pictures: [String]
})

module.exports = mongoose.model('OrderItems', OrderItemSchema)
