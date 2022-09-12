const { Router } = require('express')
const router = Router()
const DB = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
  const { username, password } = req.body

  // find the user in db
  const uname = username.toLowerCase()
  const Users = await DB.query(
    `SELECT profile.*, img_profile.img_url AS img 
      FROM profile INNER JOIN img_profile 
        ON profile.id_img=img_profile.id 
      WHERE LOWER(username)=$1`,
    [uname]
  )
  const User = Users.rows[0] // if dont have users the array [0] return undefined

  if (!User) return res.status(400).json({ message: 'invalid credentials' })
  const corretPwd = await bcrypt.compare(password, User.userpassword)
  if (!corretPwd)
    return res.status(400).json({ message: 'invalid credentials' })

  const tokenData = { id: User.id, username: User.username }
  const token = jwt.sign(tokenData, process.env.SECRET)

  return res.status(200).json({
    id: User.id,
    username: User.username,
    email: User.email,
    img: User.img,
    token,
  })
})

module.exports = router
