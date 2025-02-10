const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
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
  User.findById('678e86d8f2535e4b0bb3c603')
    .then((user) => {
      req.user = user;
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

mongoose
  .connect(
    'mongodb+srv://kamilszerlag:qQLIRtav22NKoan2@cluster-nodejs.eeutf.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster-NodeJS'
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: 'Kamil',
          email: 'kamil@wp.pl',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
