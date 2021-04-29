const app = require('./app')
const connectDatabase = require('./config/database')

const dotenv = require('dotenv');

// Setting Up Config File
dotenv.config({ path: 'backend/config/config.env' })

//Connecting to database
connectDatabase();

app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in MODE: ${process.env.NODE_ENV}`)
})