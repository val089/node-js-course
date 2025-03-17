const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
    title,
    imageUrl,
    description,
    price,
    userId: req.user
  });

  product
    .save()
    .then(() => {
      console.log('CREATED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }

  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  Product.findById(productId)
    .then((product) => {
      // check if the product belongs to the user, block editing if not
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }

      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = updatedDescription;
      return product.save();
    })
    .then(() => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // filter products by userId
  Product.find({ userId: req.user._id })
    //  .select('title price -_id') // wyświetla tylko wybrane pola
    // .populate('userId', 'name') // wyświetla dane z innych kolekcji (w tym przypadku z kolekcji users)
    .then((products) => {
      console.log(products);
      res.render('admin/products', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};
