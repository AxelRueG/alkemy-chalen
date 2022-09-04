const express = require('express')
const { logger } = require('./utils/logger')
const { errorHandler, unknowEndPoint } = require('./utils/middlewares')
require('dotenv').config()
require('express-async-errors')

const routerLogin = require('./controllers/login')
const routerUser = require('./controllers/usuario')
const routerCategories = require('./controllers/category')
const routerOperations = require('./controllers/operation')
const app = express()

// middlewares
app.use(express.json())
app.use(logger)
app.use('/public', express.static('static'))

// routes
app.use('/login', routerLogin)
app.use('/v1/user', routerUser)
app.use('/v1/categories', routerCategories)
app.use('/v1/operations', routerOperations)

// error handlers
app.use(unknowEndPoint)
app.use(errorHandler)

module.exports = app
