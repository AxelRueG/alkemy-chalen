const { Router } = require('express')
const router = Router()
const pool = require('../models')
const bcrypt = require('bcrypt')

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body
  // check valid data
  if (password.length < 8)
    return res.status(400).json({ message: 'invalid data' })

  // hash password
  const password_hash = await bcrypt.hash(password, 10)
  const img_url = `${process.env.BASE_URL}/public/img/profile_default.webp`

  // save the new user if don't exist
  try {
    await pool.query(
      'INSERT INTO profile (username,userpassword,email,img) VALUES ($1,$2,$3,$4)',
      [username, password_hash, email, img_url]
    )
  } catch (error) {
    return res.json({ message: 'invalid data' })
  }

  // return the new user created
  const response = await pool.query(
    'SELECT id,username,email,img FROM profile WHERE username=$1',
    [username]
  )
  return res.status(201).json(response.rows[0])
})

module.exports = router
