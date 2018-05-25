module.exports = function (roleNeeded) {
  return function (req, res, next) {
    if ((req.session && req.session.user) && req.session.user.role <= roleNeeded) {
      return next()
    } else {
      (req.session && req.session.user) ? res.redirect('/home') : res.redirect('/user/login')
    }
  }
}
