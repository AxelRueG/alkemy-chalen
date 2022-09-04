const unknowEndPoint = (req, res) =>
  res.status(404).json({ message: 'unknow endpoint' })

const errorHandler = (error, req, res, next) => {
  console.log('------------- MIDDLEWATE ERROR HANDLER -------------')
  console.error(error)

  if (error.name == 'CastError')
    res.status(400).json({ message: 'invalid data' })
  else if (error.name == 'CastError')
    res.status(400).json({ message: error.message })
  else if (error.name == 'JsonWebTokenError') {
    res.status(401).json({ message: 'invalid credentials' })
  } else if (error.name == 'error' && error.code == '23505') {
    res.status(400).json({ message: 'invalid data' })
  }

  next(error)
}

const checkToken = (req, res, next) => {
  const authorization = req.get('Authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
    next()
  } else {
    return res.status(401).json({ message: 'invalid credentials' })
  }
}

const dataValid = (req, res, next) => {
  const { password, email } = req.body

  // check valid data
  const validateEmail =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/

  const validatePassword = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/
  if (validatePassword.test(password) || !validateEmail.test(email))
    return res.status(400).json({ message: 'invalid data' })

  // continue
  next()
}

module.exports = { unknowEndPoint, errorHandler, checkToken, dataValid }
