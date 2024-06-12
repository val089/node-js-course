import { Router } from 'express';
export const adminRoutes = Router();
// request evokes from the top to the bottom
adminRoutes.get('/add-product', (req, res, next) => {
    console.log('In the add-product middleware!');
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
    // sends a response; headers are set automatically by Express; for this text/html
    // nie chcemy przechodzić do kolejnego middleware i dlatego nie wywołujemy next(), bo dostaniemy błąd
});
adminRoutes.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});
//# sourceMappingURL=admin.js.map