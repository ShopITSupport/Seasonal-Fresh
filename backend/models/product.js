const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product Name is required'],
        trim: true,
        maxLength: [100, 'Product Name cannot exceed 100 Characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        maxLength: [5, 'Price cannot exceed more than 5 digits'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Product Description is required']
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Product Category is required'],
        enum: {
            values: [
                'Electronics',
                'Cameras',
                'Laptops',
                'Accesories',
                'Headphones',
                'Foods',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message: 'Please select the correct category for products'
        }
    },
    seller: {
        type: String,
        required: [true, 'Product Seller is required']
    },
    stock: {
        type: Number,
        required: [true, 'Product stock is required'],
        maxLength: [5, 'Product Stock cannot exceed 5 Characters'],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', productSchema);