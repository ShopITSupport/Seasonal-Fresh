const User = require('../models/user')
const catchAsyncError = require('./catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken')

// Checks if User is authenticated
exports.isAuthenticatedUser = catchAsyncError(async(req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return next(new ErrorHandler('Login required', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id)

    next()
    
})