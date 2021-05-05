const Order = require('../models/order');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncErrors');

// Create new Order => /api/v1/order/new
exports.newOrder = catchAsyncError(async(req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
     } = req.body;

     const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
     })

     res.status(200).json({
         success: true,
         order
     })
})

// Get Single Order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return next(new ErrorHandler('No order found with id ', 404));
    }

    res.status(200).json({
        success: true,
        order
    })
})

// Get logged in user Orders => /api/v1/orders/me
exports.myOrders = catchAsyncError(async(req, res, next) => {
    const orders = await Order.find({ user : req.user.id })

    if (!orders) {
        return next(new ErrorHandler('Cannot find orders for this user ', 404));
    }

    res.status(200).json({
        success: true,
        orders
    })
})

// Get all Orders => /api/v1/admin/orders/
exports.allOrders = catchAsyncError(async(req, res, next) => {
    const orders = await Order.find()

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    if (!orders) {
        return next(new ErrorHandler('Cannot find orders for this user ', 404));
    }

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

// Update / Process Orders => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler('Cannot find the order', 404));
    }

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('Order is already delivered', 400))
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status
    order.deliveredAt = Date.now()

    await order.save();

    res.status(200).json({
        success: true
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });
}

// Delete Order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncError(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Cannot find the order', 404))
    }

    await order.remove();

    res.status(200).json({
        success: true
    })
})