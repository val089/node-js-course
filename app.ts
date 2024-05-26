import express from 'express';

const app = express();

// app.use((req, res, next) => {
//   console.log('First middleware!');
//   next();
// });

// app.use((req, res, next) => {
//   console.log('Second middleware!');
//   res.send('<h1>Hello from Express!</h1>');
// });

app.use('/users', (req, res, next) => {
  res.send({
    users: ['Kamil Kowalski', 'Jan Nowak', 'Anna Nowak'],
  });
});

app.use('/', (req, res, next) => {
  console.log('Welcome!');
  res.send('<h1>Welcome!</h1>');
});

app.listen(3000);
