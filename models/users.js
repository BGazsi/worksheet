const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  autoIncrement = require('mongoose-auto-increment');

const { hashPassword } = require('./utils')

// const connection = mongoose.createConnection("mongodb://localhost/WorksheetDb");

// autoIncrement.initialize(connection);

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
  forgotten_pwd: {
    type: Date,
  }
});

userSchema.methods = {
  isSamePassword (password) {
    return hashPassword(password, process.env.PW_SALT) === this.password
  }
}

// userSchema.plugin(autoIncrement.plugin, 'Users');
// const Users = connection.model('Users', userSchema);

// module.exports = Users;

module.exports = mongoose.model('Users', userSchema)
