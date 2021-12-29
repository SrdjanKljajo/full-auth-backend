require('express-async-errors')
const dotenv = require('dotenv')
const express = require('express')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const path = require('path')
const morgan = require('morgan')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const { connectToDatabase } = require('./config/db')

dotenv.config({ path: './config/.env' })

// Connect to postgres database
connectToDatabase()

const app = express()

//Import route files
const auth = require('./routes/auth')
const user = require('./routes/user')
const post = require('./routes/post')

// MIDDLEWARES
// Not found middlevare
const notFound = require('./middlewares/notFoundRoute')

// Database errors middlevare
const errorHandler = require('./middlewares/errorDbHandler')

// Body parser
app.use(express.json())

// Compress all HTTP responses
app.use(compression())

// Cookie parser
app.use(cookieParser(process.env.JWT_SECRET))

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Enable CORS
app.use(cors())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/v1/auth', auth)
app.use('/api/v1/users', user)
app.use('/api/v1/posts', post)

// Not found route
app.use(notFound)

// Custom database errors
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
  console.log(`Server run on ${process.env.NODE_ENV} mode, on port ${PORT}`)
})
