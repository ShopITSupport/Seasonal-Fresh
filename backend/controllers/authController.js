const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');

const catchAsyncError = require('../middlewares/catchAsyncErrors');

const sendToken = require('../utils/jwtToken');

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
