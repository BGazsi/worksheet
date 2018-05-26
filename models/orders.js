const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
  orderNumber: String,
  deadline: {
    type: Date,
    required: true
  },
  textOnItem: {
    type: String,
    required: true
  },
  sampleNeeded: {
    type: Boolean,
    default: false
  },
  scrapReplacementNeeded: {
    type: Boolean,
    default: false
  },
  otherNote: String,
  privateNote: String,
  orderItemIds: [String],
  status: {
    type: Number,
    default: 1
  },
  createdDate: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('Orders', OrderSchema)
