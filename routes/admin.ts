import { Router } from 'express';
import path from 'path';
import { rootDir } from '../util/path.js';

export const adminRoutes = Router();
// const __dirname = process.cwd(); // rootDir instead of __dirname

// request evokes from the top to the bottom
// /dodaj-produkt => GET
adminRoutes.get('/add-product', (req, res, next) => {
  // res.sendFile(path.join(__dirname, 'views', 'add-product.html'));

  res.sendFile(path.join('views', 'add-product.html'), { root: rootDir });
  // sends a response; headers are set automatically by Express; for this text/html
  // nie chcemy przechodzić do kolejnego middleware i dlatego nie wywołujemy next(), bo dostaniemy błąd
});

// /admin/add-product => POST
adminRoutes.post('/add-product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});
