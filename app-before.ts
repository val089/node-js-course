import express from 'express';
// import http from 'http';

const app = express();

// allows us to use middleware
// use() will run for every incoming request; this function will receive three arguments: request, response, and next
// app.use((req, res, next) => {
//   console.log('In the middleware!');

//   next(); // allows the request to continue to the next middleware in line
// });

app.use('/', (req, res, next) => {
  console.log('This always runs!');
  next();
});

// request evokes from the top to the bottom
app.use('/add-product', (req, res, next) => {
  console.log('In the add-product middleware!');
  res.send('<h1>Hello from Add Product!</h1>'); // sends a response; headers are set automatically by Express; for this text/html
  // nie chcemy przechodzić do kolejnego middleware i dlatego nie wywołujemy next(), bo dostaniemy błąd
});

// route '/' is set by defaults, but this is not path but paths that start with '/'
app.use('/', (req, res, next) => {
  console.log('In the main middleware!');
  res.send('<h1>Hello from Express!</h1>'); // sends a response; headers are set automatically by Express; for this text/html
});

// const server = http.createServer(app);
// server.listen(3000);
app.listen(3000); // the same as the above two lines
