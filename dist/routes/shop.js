import { Router } from 'express';
export const shopRoutes = Router();
// route '/' is set by defaults, but this is not path but paths that start with '/'
shopRoutes.get('/', (req, res, next) => {
    res.send('<h1>Hello from Express!</h1>'); // sends a response; headers are set automatically by Express; for this text/html
});
//# sourceMappingURL=shop.js.map