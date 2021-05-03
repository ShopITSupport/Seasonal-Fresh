const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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
        minlength: [6, 'Password must be at least 6 characters'],
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

//Encrypting Password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

//Compare User Password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//Return JWT Token
userSchema.methods.getJwtToken = function() {
    return jwt.sign({ 
        id: this._id
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_TIME});
}
module.exports = mongoose.model('user',userSchema)