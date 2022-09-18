const logger = (req, res, next) => {
	console.log('------------------------------------------------------------------')
	console.log(`Method: ${req.method} \tPath: ${req.path}\n`)
	next()
}

module.exports = { logger }
