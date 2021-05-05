const app = require('./app')
const connectDatabase = require('./config/database')

const dotenv = require('dotenv');

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