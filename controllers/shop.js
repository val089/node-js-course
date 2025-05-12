const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 1;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;

      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      // jest to zupełnie nowa prośba o renderowanie strony; całkowicie niezależna od poprzednich zapytań
      res.render('shop/product-list', {
        products,
        pageTitle: 'Shop',
        path: '/products',
        // totalProducts: totalItems,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); // dzęki next kod będzie wykonywany dalej
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      res.render('shop/product-details', {
        product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); // dzęki next kod będzie wykonywany dalej
    });
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;

      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      // jest to zupełnie nowa prośba o renderowanie strony; całkowicie niezależna od poprzednich zapytań
      res.render('shop/index', {
        products,
        pageTitle: 'Shop',
        path: '/',
        // totalProducts: totalItems,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); // dzęki next kod będzie wykonywany dalej
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate(['cart.items.productId'])
    .then((user) => {
      const products = user.cart.items;
      console.log(user);

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); // dzęki next kod będzie wykonywany dalej
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); // dzęki next kod będzie wykonywany dalej
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .removeFromCart(productId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); // dzęki next kod będzie wykonywany dalej
    });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.getCheckout = (req, res, next) => {
  req.user
    .populate(['cart.items.productId'])
    .then((user) => {
      const products = user.cart.items;

      let totalSum = 0;
      products.forEach((p) => {
        totalSum += p.quantity * p.productId.price;
      });

      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products,
        totalSum
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); // dzęki next kod będzie wykonywany dalej
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate(['cart.items.productId'])
    .then((user) => {
      const products = user.cart.items.map((item) => ({
        quantity: item.quantity,
        product: { ...item.productId._doc }
      }));
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products
      });

      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); // dzęki next kod będzie wykonywany dalej
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your orders',
        orders
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); // dzęki next kod będzie wykonywany dalej
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized!'));
      }

      const invoiceName = 'invoice-' + orderId + '.pdf';

      const invoicePath = path.join('data', 'invoices', invoiceName);

      // 1.
      // you use a lot of memory on the server
      // it's not good practice to load the whole file into memory for big files
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }

      //   res.setHeader('Content-Type', 'application/pdf');
      // res.sethHeader(
      //   'Content-Disposition',
      //   'inline; filename="' + invoiceName + '"'
      // );
      //   res.send(data);
      // });

      // 2.
      // it's better to use streams for big files
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.sethHeader(
      //   'Content-Disposition',
      //   'inline; filename="' + invoiceName + '"'
      // );
      // file.pipe(res); // pipe - to jest strumień, który odczytuje dane z pliku i wysyła je do odpowiedzi

      // 3. we use pdfkit to create a pdf file on the fly
      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath)); // zapisujemy plik na dysku
      pdfDoc.pipe(res); // wysyłamy plik do przeglądarki

      pdfDoc.fontSize(26).text('Hello world!', {
        underline: true
      });
      pdfDoc.text('--------------------');
      let totalPrice = 0;

      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;

        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              ' - ' +
              prod.quantity +
              ' x ' +
              '$' +
              prod.product.price
          );
      });

      pdfDoc.text('Total Price: $' + totalPrice);

      pdfDoc.end(); // kończymy tworzenie pliku pdf
    })
    .catch((err) => {
      return next(err);
    });
};
