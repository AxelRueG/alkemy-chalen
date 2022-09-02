const http = require('http')
const app = require('./app')
const server = http.Server(app)

// server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('listening in localhost:', PORT))
