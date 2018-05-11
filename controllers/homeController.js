'use strict'

const { getDefaultRenderObject } = require('../models/utils')

exports.render_home = (req, res) => {
  res.render('home', getDefaultRenderObject(req, res))
}
