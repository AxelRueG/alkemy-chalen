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

module.exports = { unknowEndPoint, errorHandler, checkToken }
