const multer = require('multer');

// Define file storage.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  },
});

function fileFilter(req, file, cb) {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed.'), false);
  }
}

const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return '0 bytes';
  }

  const dm = decimal || 2;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];

  const index = Math.floor(Math.log(bytes) / Math.log(1000));

  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index]
  );
};

// Set up multer with storage configurations and some file filter options.
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB file size limit
  fileFilter,
}).single('image');

// Catch specific file upload errors

const fileUploadErrorCatcher = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ msg: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ msg: `Multer Error: ${err.message}` });
    }
    next();
  });
};

module.exports = {
  upload,
  fileSizeFormatter,
  fileUploadErrorCatcher,
};
