const logger = (req, res, next) => {
  console.log(
    '------------------------------------------------------------------'
  )
  console.log(`method ${req.method} in url ${req.path}`)
  console.log(`body: ${req.body}\n`)
  next()
}

module.exports = { logger }
