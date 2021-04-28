const app = require('./app')

const dotenv = require('dotenv');

// Setting Up Config File
dotenv.config({ path: 'backend/config/config.env' })

app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT: ${process.env.PORT} in MODE: ${process.env.NODE_ENV}`)
})