const { Pool } = require('pg')
require('dotenv').config()

console.log(process.env.DB_NAME)

const credentials = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database:
    process.env.NODE_ENV === 'test'
      ? process.env.DB_NAME_TEST
      : process.env.DB_NAME,
  port: process.env.DB_PORT,
}

module.exports = new Pool(credentials)
