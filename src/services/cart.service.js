const { Op } = require('sequelize');
const { Cart, CartItem, ProductVariant, Product, ProductImage } = require('../models');

const getOrCreateActiveCart = async (userId) => {
    if (!userId) {
        const error = new Error('userId là bắt buộc');
        error.statusCode = 400;
        throw error;
    }

    let cart = await Cart.findOne({
        where: {
            userId,
            status: 'active'
        }
    });

    if (!cart) {
        cart = await Cart.create({
            userId,
            status: 'active'
        });
    }

    return cart;
};

const resolveStock = async (productId, variantId) => {
    if (variantId != null) {
        const variant = await ProductVariant.findByPk(variantId);

        if (!variant) {
            const error = new Error('Biến thể sản phẩm không tồn tại');
            error.statusCode = 404;
            throw error;
        }

        if (Number(variant.productId) !== Number(productId)) {
            const error = new Error('Biến thể không thuộc sản phẩm này');
            error.statusCode = 400;
            throw error;
        }

        if (!variant.isActive) {
            const error = new Error('Biến thể không còn bán');
            error.statusCode = 400;
            throw error;
        }

        return variant.stockQuantity;
    }

    const product = await Product.findByPk(productId);

    if (!product) {
        const error = new Error('Sản phẩm không tồn tại');
        error.statusCode = 404;
        throw error;
    }

    return product.stockQuantity;
};

const resolveUnitPrice = (product, variant) => {
    if (variant && variant.price != null) {
        return Number(variant.price);
    }
    return Number(product.price);
};

const assertProductSellable = (product) => {
    if (!product) {
        const error = new Error('Sản phẩm không tồn tại');
        error.statusCode = 404;
        throw error;
    }
    if (product.status !== 'active') {
        const error = new Error('Sản phẩm không còn bán');
        error.statusCode = 400;
        throw error;
    }
};

function mapCartItemRow(item) {
    const json = item.toJSON ? item.toJSON() : item;
    const product = json.product || {};
    const variant = json.variant || null;
    const images = product.images || [];
    const primaryImage = images.find((img) => img.isPrimary) || images[0] || null;
    const unitPrice = Number(json.unitPrice);
    const quantity = json.quantity;
    const lineTotal = Math.round(unitPrice * quantity * 100) / 100;

    return {
        id: json.id,
        productId: json.productId,
        variantId: json.variantId,
        quantity,
        unitPrice,
        lineTotal,
        isSelected: json.isSelected == null ? true : Boolean(json.isSelected),
        product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price != null ? Number(product.price) : null,
            stockQuantity: product.stockQuantity,
            status: product.status,
            imageUrl: primaryImage?.url || null
        },
        variant: variant
            ? {
                  id: variant.id,
                  name: variant.name,
                  price: variant.price != null ? Number(variant.price) : null,
                  stockQuantity: variant.stockQuantity
              }
            : null
    };
}

const buildCartResponse = (cart, items) => {
    const mappedItems = items.map(mapCartItemRow);
    const itemCount = mappedItems.reduce((sum, row) => sum + row.quantity, 0);
    const subtotal = mappedItems.reduce((sum, row) => sum + row.lineTotal, 0);

    const selectedItems = mappedItems.filter((row) => row.isSelected);
    const selectedItemCount = selectedItems.reduce((sum, row) => sum + row.quantity, 0);
    const selectedSubtotal = selectedItems.reduce((sum, row) => sum + row.lineTotal, 0);

    return {
        cart: {
            id: cart.id,
            status: cart.status
        },
        items: mappedItems,
        summary: {
            itemCount,
            subtotal: Math.round(subtotal * 100) / 100,
            selectedItemCount,
            selectedSubtotal: Math.round(selectedSubtotal * 100) / 100,
            allSelected: mappedItems.length > 0 && mappedItems.every((row) => row.isSelected)
        }
    };
};

const loadCartItems = async (cartId) => {
    return CartItem.findAll({
        where: { cartId },
        include: [
            {
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'slug', 'price', 'stockQuantity', 'status'],
                include: [
                    {
                        model: ProductImage,
                        as: 'images',
                        attributes: ['url', 'altText', 'isPrimary'],
                        required: false
                    }
                ]
            },
            {
                model: ProductVariant,
                as: 'variant',
                attributes: ['id', 'name', 'price', 'stockQuantity'],
                required: false
            }
        ],
        order: [['createdAt', 'ASC']]
    });
};

const getCartForUser = async (userId) => {
    const cart = await getOrCreateActiveCart(userId);
    const items = await loadCartItems(cart.id);
    return buildCartResponse(cart, items);
};

const findExistingCartItem = async (cartId, productId, variantId) => {
    const where = {
        cartId,
        productId
    };
    if (variantId != null) {
        where.variantId = variantId;
    } else {
        where.variantId = { [Op.is]: null };
    }
    return CartItem.findOne({ where });
};

const addItem = async (userId, { productId, variantId = null, quantity = 1 }) => {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
        const error = new Error('Số lượng phải là số nguyên dương');
        error.statusCode = 400;
        throw error;
    }

    const product = await Product.findByPk(productId);
    assertProductSellable(product);

    let variant = null;
    if (variantId != null) {
        variant = await ProductVariant.findByPk(variantId);
        if (!variant) {
            const error = new Error('Biến thể sản phẩm không tồn tại');
            error.statusCode = 404;
            throw error;
        }
        if (Number(variant.productId) !== Number(productId)) {
            const error = new Error('Biến thể không thuộc sản phẩm này');
            error.statusCode = 400;
            throw error;
        }
        if (!variant.isActive) {
            const error = new Error('Biến thể không còn bán');
            error.statusCode = 400;
            throw error;
        }
    }

    const stock = await resolveStock(productId, variantId);
    const cart = await getOrCreateActiveCart(userId);
    const existing = await findExistingCartItem(cart.id, productId, variantId);
    const newQty = existing ? existing.quantity + qty : qty;

    if (newQty > stock) {
        const error = new Error(`Chỉ còn ${stock} sản phẩm trong kho`);
        error.statusCode = 400;
        throw error;
    }

    const unitPrice = resolveUnitPrice(product, variant);

    if (existing) {
        await existing.update({ quantity: newQty, unitPrice });
    } else {
        await CartItem.create({
            cartId: cart.id,
            productId,
            variantId: variantId ?? null,
            quantity: qty,
            unitPrice,
            isSelected: true
        });
    }

    return getCartForUser(userId);
};

const updateItemQuantity = async (userId, itemId, quantity) => {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
        const error = new Error('Số lượng phải là số nguyên dương');
        error.statusCode = 400;
        throw error;
    }

    const item = await CartItem.findByPk(itemId, {
        include: [{ model: Cart, as: 'cart' }]
    });

    if (!item || !item.cart || Number(item.cart.userId) !== Number(userId)) {
        const error = new Error('Dòng giỏ hàng không tồn tại');
        error.statusCode = 404;
        throw error;
    }

    const stock = await resolveStock(item.productId, item.variantId);
    if (qty > stock) {
        const error = new Error(`Chỉ còn ${stock} sản phẩm trong kho`);
        error.statusCode = 400;
        throw error;
    }

    await item.update({ quantity: qty });
    return getCartForUser(userId);
};

const removeItem = async (userId, itemId) => {
    const item = await CartItem.findByPk(itemId, {
        include: [{ model: Cart, as: 'cart' }]
    });

    if (!item || !item.cart || Number(item.cart.userId) !== Number(userId)) {
        const error = new Error('Dòng giỏ hàng không tồn tại');
        error.statusCode = 404;
        throw error;
    }

    await item.destroy();
    return getCartForUser(userId);
};

const getOwnedCartItem = async (userId, itemId) => {
    const item = await CartItem.findByPk(itemId, {
        include: [{ model: Cart, as: 'cart' }]
    });

    if (!item || !item.cart || Number(item.cart.userId) !== Number(userId)) {
        const error = new Error('Dòng giỏ hàng không tồn tại');
        error.statusCode = 404;
        throw error;
    }

    return item;
};

const setItemSelected = async (userId, itemId, isSelected) => {
    const item = await getOwnedCartItem(userId, itemId);
    await item.update({ isSelected: Boolean(isSelected) });
    return getCartForUser(userId);
};

const setAllItemsSelected = async (userId, isSelected) => {
    const cart = await getOrCreateActiveCart(userId);
    await CartItem.update(
        { isSelected: Boolean(isSelected) },
        { where: { cartId: cart.id } }
    );
    return getCartForUser(userId);
};

module.exports = {
    getOrCreateActiveCart,
    resolveStock,
    getCartForUser,
    addItem,
    updateItemQuantity,
    removeItem,
    setItemSelected,
    setAllItemsSelected
};
