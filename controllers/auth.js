const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  console.log('req.session.isLoggedIn', req.session.isLoggedIn);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login page',
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  // w ten sposób te dane nie są gromadzone; te dane są tracone po przekazaniu odpowiedzi
  // req is dead after sending res-response; better way is to use cookies or sessions
  // req.isLoggedIn = true;

  // Available options:
  // res.setHeader('Set-Cookie', 'loggedIn=true; Expiress='); for setting expiration date
  // res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10'); for setting max age
  // res.setHeader('Set-Cookie', 'loggedIn=true; Domain='); for setting domain
  // res.setHeader('Set-Cookie', 'loggedIn=true; Secure'); for https
  // res.setHeader('Set-Cookie', 'loggedIn=true; httpOnly'); for not allowing js to access cookie

  // res.setHeader('Set-Cookie', 'loggedIn=true');

  User.findById('678e86d8f2535e4b0bb3c603')
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        // redirecting after saving session
        console.log(err);
        res.redirect('/');
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
