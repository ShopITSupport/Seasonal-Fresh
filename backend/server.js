const app = require('./app')
const connectDatabase = require('./config/database')

const dotenv = require('dotenv');
const cloudinary = require('cloudinary');

//Handle Uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down server due to uncaught exception`);
    process.exit(1)
})

// Setting Up Config File
dotenv.config({ path: 'backend/config/config.env' })

//Connecting to database
connectDatabase();

// Setting up Cloudinary Config
cloudinary.config({ 
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in MODE: ${process.env.NODE_ENV}`)
})

// Handle Unhandled Promise rejections
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.stack}`);
    console.log(`Shutting down server due to unhandled promise rejection`);
    server.close(() => {
        process.exit(1)
    })
})