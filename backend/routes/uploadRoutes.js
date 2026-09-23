const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/upload - Direct multipart image upload
router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded or file type rejected.' });
  }

  // Derive relative URL from destination directory and filename
  const folder = req.file.destination.split(/[\\/]/).pop();
  const fileUrl = `/storage/${folder}/${req.file.filename}`;

  res.json({
    success: true,
    url: fileUrl,
    path: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

module.exports = router;
