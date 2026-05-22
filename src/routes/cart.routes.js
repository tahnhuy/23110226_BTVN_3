const express = require('express');
const { body, param } = require('express-validator');
const cartController = require('../controllers/cart.controller');
const { verifyToken, requirePermission } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validation.middleware');

const router = express.Router();

router.use(verifyToken);
router.use(requirePermission('cart:manage'));

const addItemValidation = [
    body('productId').isInt({ min: 1 }).withMessage('productId phải là số nguyên dương'),
    body('variantId').optional({ nullable: true }).isInt({ min: 1 }).withMessage('variantId không hợp lệ'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('quantity phải >= 1')
];

const updateItemValidation = [
    param('itemId').isInt({ min: 1 }).withMessage('itemId không hợp lệ'),
    body('quantity').isInt({ min: 1 }).withMessage('quantity phải >= 1')
];

const removeItemValidation = [param('itemId').isInt({ min: 1 }).withMessage('itemId không hợp lệ')];

const selectItemValidation = [
    param('itemId').isInt({ min: 1 }).withMessage('itemId không hợp lệ'),
    body('isSelected').isBoolean().withMessage('isSelected phải là true hoặc false')
];

const selectAllValidation = [
    body('isSelected').isBoolean().withMessage('isSelected phải là true hoặc false')
];

router.get('/', cartController.getCart);

router.post('/items', addItemValidation, validate, cartController.addCartItem);

router.patch('/selection', selectAllValidation, validate, cartController.setCartSelection);

router.patch('/items/:itemId/select', selectItemValidation, validate, cartController.setCartItemSelected);

router.patch('/items/:itemId', updateItemValidation, validate, cartController.updateCartItem);

router.delete('/items/:itemId', removeItemValidation, validate, cartController.removeCartItem);

module.exports = router;
