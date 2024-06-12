import express from 'express';
import path from 'path';
// import http from 'http';
import bodyPareser from 'body-parser';
import { adminRoutes } from './routes/admin.js';
import { shopRoutes } from './routes/shop.js';

const app = express();
const __dirname = path.resolve();

app.use(bodyPareser.urlencoded({ extended: false })); // allows us to parse incoming requests
app.use(express.static(path.join(__dirname, 'public'))); // allows us to serve static files
app.use(shopRoutes); // allows us to use the routes from shop.js

// all routes with begin with /admin and we don't have to repeat it in the routes in admin.js
app.use('/admin', adminRoutes); // allows us to use the routes from admin.js

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);
