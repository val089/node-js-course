const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//handlebars zamiast pug
app.set('view engine', 'ejs'); // tak mogę zmieniać rozszerzenie  pliku

// set global configuration for the view engine
// pug engine is used to render the views
// app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found - 404' });
});

app.listen(3000);
