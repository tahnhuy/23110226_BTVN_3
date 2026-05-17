const express = require('express');
const {
    listMajors,
    listCategories,
    listProducts,
    getProduct
} = require('../controllers/catalog.controller');

const router = express.Router();

router.get('/majors', listMajors);
router.get('/categories', listCategories);
router.get('/products', listProducts);
router.get('/products/:slug', getProduct);

module.exports = router;
