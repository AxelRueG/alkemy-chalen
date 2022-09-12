const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/profile-img')
  },
  filename: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, `${Date.now()}-${file.originalname}`)
    } else {
      throw Error('invalid file type')
    }
  },
})

const upload = multer({ storage: storage })

module.exports = upload
