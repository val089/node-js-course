import { Router } from 'express';
import path from 'path'; // path is a core module in Node.js
import { rootDir } from '../util/path.js';

export const shopRoutes = Router();
// const __dirname = path.resolve();
const __dirname = process.cwd();
console.log('__dirname: ', __dirname);
console.log('rootDir: ', rootDir);

// route '/' is set by defaults, but this is not path but paths that start with '/'
shopRoutes.get('/', (req, res, next) => {
  // res.send('<h1>Hello from Express!</h1>'); // sends a response; headers are set automatically by Express; for this text/html

  // __dirname is a global variable that is available in every file in Node.js
  // res.sendFile('./views/shop.html', { root: process.cwd() });
  res.sendFile(path.join('views', 'shop.html'), { root: rootDir });
});
