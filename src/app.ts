/*
Core More Modules
- http
- https
- fs
- path
- os
*/

/*
fs

const fs = require('fs');
fs.writeFileSync('hello.txt', 'Hello from Node.js');
*/

import http from 'http'; // dodajemy do package.json "type": "module"
import { exampleText } from './helper.js'; // musimy dodać rozszerzenie .js jeśli używamy NodeNext i type: module (musi być .js pomimo, że jest ts :P mind fuck)
// const http = require('http'); // commonjs

import { routes } from './routes.js';

// zwracamy server i musimy go przypisać do zmiennej aby dostać do innych jego metod jak listen
const server = http.createServer(routes);

server.listen(3000);
