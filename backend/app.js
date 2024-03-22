const express = require('express')
const { logger } = require('./utils/logger')
const { errorHandler, unknowEndPoint } = require('./utils/middlewares')
const cors = require('cors')

if (process.env.NODE_ENV !== "production") require('dotenv').config()
require('express-async-errors')

const routerLogin = require('./controllers/login')
const routerUser = require('./controllers/usuario')
const routerCategories = require('./controllers/category')
const routerOperations = require('./controllers/operation')
const routerImagesProfile = require('./controllers/images')
const app = express()

// middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logger)
app.use(express.static('build'))
app.use('/public', express.static('static'))

// routes
app.use('/login', routerLogin)
app.use('/v1/user', routerUser)
app.use('/v1/categories', routerCategories)
app.use('/v1/operations', routerOperations)
app.use('/v1/images_profile', routerImagesProfile)

// error handlers
app.use(unknowEndPoint)
app.use(errorHandler)

module.exports = app
