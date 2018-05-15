const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { hashPassword } = require('./utils')

const userSchema = new Schema({
  role: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    unique : true,
    required : true,
    dropDups: true
  },
  name: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    required: true,
    default: true
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
})

userSchema.methods = {
  isSamePassword (password) {
    return hashPassword(password, process.env.PW_SALT) === this.password
  }
}

module.exports = mongoose.model('Users', userSchema)
