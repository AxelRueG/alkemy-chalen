const { Router, json } = require('express')
const router = Router()
const DB = require('../models')
const jwt = require('jsonwebtoken')
const { checkToken } = require('../utils/middlewares')

router.post('/', checkToken, async (req, res) => {
  // geting user
  const User = jwt.verify(req.token, process.env.SECRET)
  let { title, description, pubDate, amount, categoryId } = req.body

  const id_category = process.env.NODE_ENV == 'test' ? 4 : 1
  pubDate = pubDate ? pubDate : new Date()
  amount = Math.abs(amount)
  amount = categoryId === id_category ? amount : -amount

  await DB.query(
    `INSERT INTO operation
        (id_profile,id_category,title,description,pub_date,amount)
        VALUES ($1,$2,$3,$4,$5,$6)`,
    [User.id, categoryId, title, description, pubDate, amount]
  )
  const Operation = await DB.query(
    'SELECT o.*,c.name,c.img FROM operation o INNER JOIN category c ON o.id_category=c.id WHERE o.title=$1 AND o.pub_date=$2 AND o.amount=$3 AND o.id_category=$4',
    [title, pubDate, amount, categoryId]
  )
  return res.status(201).json(Operation.rows[0])
})

router.get('/', checkToken, async (req, res) => {
  const User = jwt.verify(req.token, process.env.SECRET)

  const operations = await DB.query(
    'SELECT o.*,c.name,c.img FROM operation o INNER JOIN category c ON o.id_category=c.id AND o.id_profile=$1',
    [User.id]
  )
  return res.status(200).json(operations.rows)
})

module.exports = router
