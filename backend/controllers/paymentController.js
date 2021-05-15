const catchAsyncError = require('../middlewares/catchAsyncErrors')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Process Stripe Payments => /api/v1/payment/process

exports.processPayment = catchAsyncError(async(req, res, next) => {
    const paymentIntent = await stripe.paymentIntent.create({
        amount: req.body.amount,
        currency: 'inr',
        metadata: { integration_check: 'accept_a_payment' }
    })

    res.status(200).json({
        success: true,
        client_Secret: paymentIntent.client_Secret
    })
})

// Send Stripe API KEY => /api/v1/stripeapi

exports.sendStripeAPI = catchAsyncError(async(req, res, next) => {

    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })
})