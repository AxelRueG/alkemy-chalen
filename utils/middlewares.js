const unknowEndPoint = (req, res) =>
  res.status(404).json({ message: 'unknow endpoint' })

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  switch (error.name) {
    case 'CastError':
      return res.status(400).json({ message: 'invalid data' })
    case 'ValidationError':
      return res.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = { unknowEndPoint, errorHandler }
