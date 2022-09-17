const { Router } = require('express')
const router = Router()
const DB = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { dataValid, checkToken } = require('../utils/middlewares')

router.get('/', checkToken, async (req, res) => {
	const User = jwt.verify(req.token, process.env.SECRET)
	// get the sum of all operations of an user
	const response = await DB.query(
		`
    SELECT SUM(amount) AS summary FROM operation o WHERE o.id_profile=$1
    `,
		[User.id]
	)
	return res.status(200).json(response.rows[0])
})

router.post('/', dataValid, async (req, res) => {
	const { username, password, email } = req.body

	// hash password
	const password_hash = await bcrypt.hash(password, 10)

	// save the new user if don't exist
	await DB.query(
		'INSERT INTO profile (username,userpassword,email,id_img) VALUES ($1,$2,$3,$4)',
		[username, password_hash, email, 1]
	)

	return res.status(201).json({ message: 'user created successfully' })
})

router.put('/username', checkToken, async (req, res) => {
	// verify the user is logged and get his new user name
	const User = jwt.verify(req.token, process.env.SECRET)
	const { username } = req.body

	await DB.query('UPDATE profile SET username=$1 WHERE id=$2', [
		username,
		User.id,
	])

	return res.status(201).json({ id: User.id, username })
})

router.put('/password', checkToken, async (req, res) => {
	// regular expresion to evaluate if the new password is valid
	//   if have an number, an lowercase and uppercase character
	const validatePassword = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/

	// check if the user is logged
	const User = jwt.verify(req.token, process.env.SECRET)
	const { password1, password2 } = req.body
	const oldpassword = req.body.oldpassword || ''

	// get the current password and eval if its correct
	let currentPassword = await DB.query(
		'SELECT userpassword FROM profile WHERE id=$1',
		[User.id]
	)
	currentPassword = currentPassword.rows[0].userpassword
	const currentPasswordValid = await bcrypt.compare(
		oldpassword,
		currentPassword
	)
	// if the current password is incorret or the new password is invalid
	// or dont match with the confirm password return an error message
	if (
		!(
			currentPasswordValid &&
			validatePassword.test(password1) &&
			password1 === password2
		)
	) {
		return res.status(400).json({ message: 'invalid data' })
	}

	// if all before is correct update the password
	const password_hash = await bcrypt.hash(password1, 10)
	await DB.query('UPDATE profile SET userpassword=$1 WHERE id=$2', [
		password_hash,
		User.id,
	])

	return res.status(201).json({ message: 'password changed' })
})

router.put('/image', checkToken, async (req, res) => {
	const User = jwt.verify(req.token, process.env.SECRET)
	const id_img = Number(req.body.id_img)

	await DB.query('UPDATE profile SET id_img=$2 WHERE id=$1', [User.id, id_img])

	return res.status(201).json({ message: 'image profile changed' })
})

module.exports = router
