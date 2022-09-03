const unknowEndPoint = (req, res) =>
  res.status(404).json({ message: 'unknow endpoint' })

const errorHandler = (error, req, res, next) => {
  console.log('------------- MIDDLEWATE ERROR HANDLER -------------')
  console.error(error)

  if (error.name == 'CastError')
    res.status(400).json({ message: 'invalid data' })
  else if (error.name == 'CastError')
    res.status(400).json({ error: error.message })
  else if (error.name == 'JsonWebTokenError') {
    res.status(401).json({ error: 'invalid credentials' })
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
  const regExpresion =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/

  if (password.length < 8 || !regExpresion.test(email))
    return res.status(400).json({ message: 'invalid data' })

  // continue
  next()
}

module.exports = { unknowEndPoint, errorHandler, checkToken, dataValid }
