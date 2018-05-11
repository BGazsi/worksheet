const crypto = require('crypto')

exports.hashPassword = password => {
  const hash = crypto.createHmac('sha256', process.env.PW_SALT)
  hash.update(password)
  return hash.digest('hex')
}

exports.getDefaultRenderObject = (req, res) => {
  return {
    user: req.session.user || '',
    error: []
  }
}
