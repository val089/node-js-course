const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

// const MONGODB_URI =
//   'mongodb+srv://kamilszerlag:qQLIRtav22NKoan2@cluster-nodejs.eeutf.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster-NodeJS';

const MONGODB_URI =
  'mongodb+srv://kamilszerlag:qQLIRtav22NKoan2@cluster-nodejs.eeutf.mongodb.net/shop?&w=majority&appName=Cluster-NodeJS';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
  // expires: 1000 * 60 * 60 * 2 // 2 hours // i can add expires option to delete old sessions from db
});
const csrfProtection = csrf({});

// set global configuration for the view engine
// pug engine is used to render the views
// app.set('view engine', 'pug');
//handlebars zamiast pug
app.set('view engine', 'ejs'); // tak mogę zmieniać rozszerzenie  pliku
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// session initialization
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store // here will be session store in db
  })
);
// after session initialization we can use csrf protection
app.use(csrfProtection);
// flash messages initialization
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    // if we don't have user go to next middleware
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      // we set user from db to session and thanks to that we can use all methods from user model (moongose)
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res, next) => {
  // we set csrf token to all views
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    // we don't need to create dummy user
    // User.findOne().then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       name: 'Kamil',
    //       email: 'kamil@wp.pl',
    //       cart: {
    //         items: []
    //       }
    //     });
    //     user.save();
    //   }
    // });

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
