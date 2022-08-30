const express = require('express')
require('dotenv').config()
const { logger } = require('./utils/logger')
const routerOperation = require('./routes/operation')

const app = express()

app.use(express.json())
app.use(logger)
app.use('/public',express.static('static'))

const PORT = process.env.PORT || 3000
app.listen(PORT,() => console.log(`listening in localhost:${PORT}`))
