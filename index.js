const express = require('express')
require('dotenv').config()
const { logger } = require('./utils/logger')
const { errorHandler, unknowEndPoint } = require('./utils/middlewares')
const routerOperation = require('./routes/operation')

const app = express()

// middlewares
app.use(express.json())
app.use(logger)
app.use('/public', express.static('static'))

// routes

// error handlers
app.use(unknowEndPoint)
app.use(errorHandler)

// server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`listening in localhost:${PORT}`))
