// const path = require('path');

const express = require('express');

// const rootDir = require('../util/path');
const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
// we pass a reference to the controller function
router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

module.exports = router;
