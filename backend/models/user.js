const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({ 
    name: { 
        type: String,
        required: [true, 'User Name is required'],
        maxLength: [30, 'User Name Cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validator: [validator.isEmail, 'Enter valid Email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

module.exports = mongoose.model('user',userSchema)