const express = require('express')
const { logger } = require('./utils/logger')
const { errorHandler, unknowEndPoint } = require('./utils/middlewares')
const routerUser = require('./controllers/usuario')
require('dotenv').config()
require('express-async-errors')

const app = express()

// middlewares
app.use(express.json())
app.use(logger)
app.use('/public', express.static('static'))

// routes
app.use('/v1/user', routerUser)

// error handlers
app.use(unknowEndPoint)
app.use(errorHandler)

module.exports = app
