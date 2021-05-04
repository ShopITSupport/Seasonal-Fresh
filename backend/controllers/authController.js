const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');

const catchAsyncError = require('../middlewares/catchAsyncErrors');

const sendToken = require('../utils/jwtToken');

const sendEmail = require('../utils/sendEmail');

const crypto = require('crypto');

// Register User => /api/v1/register
exports.registerUser = catchAsyncError( async(req, res, next) => {

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'wp6370545-money-heist-hd-desktop-wallpapers_zplli3',
            url: 'https://res.cloudinary.com/dm7kwkvjg/image/upload/v1620011056/wp6370545-money-heist-hd-desktop-wallpapers_zplli3.jpg'
        }
    })

    sendToken(user, 200, res)
})


// Login User => /api/v1/login
exports.loginUser = catchAsyncError(async(req, res, next) => {
    const { email, password } = req.body;

    //Checks if email and password is valid

    if (!email || !password) {
        return next(new ErrorHandler('Please enter Email and Password', 400));
    }

    // Finding User in database
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    // Checks if Password is valid
    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res)
})

//Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler('Invalid Email', 404));
    }

    //Get Reset Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false })

    // Create Reset Password URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you are not requested this email then ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password recovery email',
            message
        })
        
        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }

})

//Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async(req, res, next) => {
    //Hash URL Token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if (req.body.password != req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    //Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
})

//Logout User => /api/v1/logout
exports.logout = catchAsyncError(async(req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()), 
        httponly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged Out'
    })
})