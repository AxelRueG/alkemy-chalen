const { Router } = require('express')
const router = Router()
const DB = require('../models')

router.get('/', async (req, res) => {
  const categories = await DB.query('SELECT * FROM category')
  return res.status(200).json(categories.rows)
})

module.exports = router
