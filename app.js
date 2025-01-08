const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

// set global configuration for the view engine
// pug engine is used to render the views
// app.set('view engine', 'pug');
//handlebars zamiast pug
app.set('view engine', 'ejs'); // tak mogę zmieniać rozszerzenie  pliku
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('6751e5b558c6fafbe59fb0d0')
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      // continue next step
      next();
    })
    .catch((err) => {
      console.log(err);
      // next(err);
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});

// mongoConnect();
