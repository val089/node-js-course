import express from 'express';
// import http from 'http';
import bodyPareser from 'body-parser';
import { adminRoutes } from './routes/admin.js';
import { shopRoutes } from './routes/shop.js';
const app = express();
app.use(bodyPareser.urlencoded({ extended: false })); // allows us to parse incoming requests
app.use(adminRoutes); // allows us to use the routes from admin.js
app.use(shopRoutes); // allows us to use the routes from shop.js
app.listen(3000);
// allows us to use middleware
// use() will run for every incoming request; this function will receive three arguments: request, response, and next
// app.use((req, res, next) => {
//   console.log('In the middleware!');
//   next(); // allows the request to continue to the next middleware in line
// });
//# sourceMappingURL=app.js.map