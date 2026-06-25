const multer = require('multer');

// Store uploads in memory as Buffer – appropriate for base64/logo handling
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, SVG and WebP images are allowed.'));
    }
  }
});

module.exports = upload;
