const { Router } = require('express')
const router = Router()
const DB = require('../models')
const bcrypt = require('bcrypt')
const { dataValid } = require('../utils/middlewares')

router.post('/', dataValid, async (req, res) => {
  const { username, password, email } = req.body

  // hash password
  const password_hash = await bcrypt.hash(password, 10)
  const img_url = `${process.env.BASE_URL}/public/img/profile_default.webp`

  // save the new user if don't exist
  try {
    await DB.query(
      'INSERT INTO profile (username,userpassword,email,img) VALUES ($1,$2,$3,$4)',
      [username, password_hash, email, img_url]
    )
  } catch (error) {
    return res.status(400).json({ message: 'invalid data' })
  }

  // return the new user created
  const response = await DB.query(
    'SELECT id,username,email,img FROM profile WHERE username=$1',
    [username]
  )
  return res.status(201).json(response.rows[0])
})

module.exports = router
