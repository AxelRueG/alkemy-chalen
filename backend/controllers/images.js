const { Router } = require('express')
const router = Router()
const DB = require('../models')

router.get('/', async (req,res) => {
  const response = await DB.query('SELECT * FROM img_profile')
  return res.status(200).json(response.rows)
})

module.exports = router