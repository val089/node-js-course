module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    // automaticly we will get status code 401
    return res.redirect('/login');
  }
  next();
};
