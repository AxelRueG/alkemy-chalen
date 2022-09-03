const { Router, json } = require('express')
const router = Router()
const DB = require('../models')
const jwt = require('jsonwebtoken')
const { checkToken } = require('../utils/middlewares')

router.post('/', checkToken, async (req, res) => {
  // geting user
  const User = jwt.verify(req.token, process.env.SECRET)
  let { title, description, pub_date, amount, id_category } = req.body

  // @TODO: solve this line
  const categoryId = process.env.NODE_ENV == 'test' ? 4 : 1
  // check if the pub_date is valid else put the current date for default
  pub_date = pub_date ? pub_date : new Date()
  // all values will be positive and have a signed depend of the category
  amount = Math.abs(amount)
  amount = id_category === categoryId ? amount : -amount

  await DB.query(
    `INSERT INTO operation
        (id_profile,id_category,title,description,pub_date,amount)
        VALUES ($1,$2,$3,$4,$5,$6)`,
    [User.id, id_category, title, description, pub_date, amount]
  )
  // get the operation iserted, this query not is 100% in infallible
  // @TODO: resolve this query
  const Operation = await DB.query(
    `SELECT o.*,c.name,c.img 
    FROM operation o INNER JOIN category c 
      ON o.id_category=c.id 
    WHERE o.title=$1 AND o.pub_date=$2 AND o.amount=$3 AND o.id_category=$4`,
    [title, pub_date, amount, id_category]
  )
  return res.status(201).json(Operation.rows[0])
})

router.get('/', checkToken, async (req, res) => {
  const User = jwt.verify(req.token, process.env.SECRET)
  // find all operation that belong the user and return the array
  const operations = await DB.query(
    `SELECT o.*,c.name,c.img 
    FROM operation o INNER JOIN category c 
      ON o.id_category=c.id 
    WHERE o.id_profile=$1`,
    [User.id]
  )
  return res.status(200).json(operations.rows)
})

router.put('/:id', checkToken, async (req, res) => {
  const User = jwt.verify(req.token, process.env.SECRET)
  const id = Number(req.params.id)
  const { title, description, pub_date, amount, id_category } = req.body

  // only update when the operation when this belong to user
  await DB.query(
    `UPDATE operation
    SET 
      title=$1,
      description=$2,
      pub_date=$3,
      amount=$4,
      id_category=$5
    WHERE id=$6 AND id_profile=$7`,
    [title, description, pub_date, amount, id_category, id, User.id]
  )

  // find the operation updated for return
  const operationUpdate = await DB.query(
    `SELECT o.*,c.name,c.img 
    FROM operation o INNER JOIN category c 
      ON o.id_category=c.id 
    WHERE o.id=$1 AND id_profile=$2`,
    [id, User.id]
  )

  // if dont belong to user or dont exist retun an empty array
  const response = operationUpdate.rows[0] || []
  return res.status(201).json(response)
})

module.exports = router
