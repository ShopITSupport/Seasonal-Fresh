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

//Handling User Roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403))
        }
        next()
    }
}