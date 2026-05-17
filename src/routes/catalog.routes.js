const express = require('express');
const {
    listMajors,
    listCategories,
    listProducts,
    getProduct,
    getHome
} = require('../controllers/catalog.controller');

const router = express.Router();

router.get('/home', getHome);
router.get('/majors', listMajors);
router.get('/categories', listCategories);
router.get('/products', listProducts);
router.get('/products/:slug', getProduct);

module.exports = router;
