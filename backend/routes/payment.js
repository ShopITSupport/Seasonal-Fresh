const express = require('express');
const router = express.Router();

const { 
    processPayment,
    sendStripeAPI
} = require('../controllers/paymentController');

const { isAuthenticatedUser } = require('../middlewares/auth');

router.route('/payment/process').post(isAuthenticatedUser, processPayment);
router.route('/stripeapi').get(isAuthenticatedUser, sendStripeAPI);

module.exports = router;