const { Router } = require('express')
const router = Router()
const DB = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { dataValid, checkToken } = require('../utils/middlewares')

router.post('/', dataValid, async (req, res) => {
  const { username, password, email } = req.body

  // hash password
  const password_hash = await bcrypt.hash(password, 10)
  const img_url = `${process.env.BASE_URL}/public/img/profile_default.webp`

  // save the new user if don't exist
  await DB.query(
    'INSERT INTO profile (username,userpassword,email,img) VALUES ($1,$2,$3,$4)',
    [username, password_hash, email, img_url]
  )

  // return the new user created
  const response = await DB.query(
    'SELECT id,username,email,img FROM profile WHERE username=$1',
    [username]
  )
  return res.status(201).json(response.rows[0])
})

router.put('/username', checkToken, async (req, res) => {
  const User = jwt.verify(req.token, process.env.SECRET)
  const { username } = req.body

  console.log(User, username)

  await DB.query('UPDATE profile SET username=$1 WHERE id=$2', [
    username,
    User.id,
  ])

  return res.status(201).json({ id: User.id, username })
})

module.exports = router
