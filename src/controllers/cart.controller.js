const cartService = require('../services/cart.service');
const { successResponse } = require('../utils/responseHandler');

const getCart = async (req, res, next) => {
    try {
        const data = await cartService.getCartForUser(req.user.id);
        return successResponse(res, 200, 'OK', data);
    } catch (error) {
        next(error);
    }
};

const addCartItem = async (req, res, next) => {
    try {
        const { productId, variantId, quantity } = req.body;
        const data = await cartService.addItem(req.user.id, {
            productId: Number(productId),
            variantId: variantId != null ? Number(variantId) : null,
            quantity
        });
        return successResponse(res, 200, 'Đã thêm vào giỏ hàng', data);
    } catch (error) {
        next(error);
    }
};

const updateCartItem = async (req, res, next) => {
    try {
        const itemId = Number(req.params.itemId);
        const { quantity } = req.body;
        const data = await cartService.updateItemQuantity(req.user.id, itemId, quantity);
        return successResponse(res, 200, 'Đã cập nhật giỏ hàng', data);
    } catch (error) {
        next(error);
    }
};

const setCartItemSelected = async (req, res, next) => {
    try {
        const itemId = Number(req.params.itemId);
        const { isSelected } = req.body;
        const data = await cartService.setItemSelected(req.user.id, itemId, isSelected);
        return successResponse(res, 200, 'Đã cập nhật lựa chọn', data);
    } catch (error) {
        next(error);
    }
};

const setCartSelection = async (req, res, next) => {
    try {
        const { isSelected } = req.body;
        const data = await cartService.setAllItemsSelected(req.user.id, isSelected);
        return successResponse(res, 200, 'Đã cập nhật lựa chọn', data);
    } catch (error) {
        next(error);
    }
};

const removeCartItem = async (req, res, next) => {
    try {
        const itemId = Number(req.params.itemId);
        const data = await cartService.removeItem(req.user.id, itemId);
        return successResponse(res, 200, 'Đã xóa khỏi giỏ hàng', data);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCart,
    addCartItem,
    updateCartItem,
    setCartItemSelected,
    setCartSelection,
    removeCartItem
};
