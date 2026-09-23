const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Resolve the root storage directory
const STORAGE_ROOT = path.resolve(__dirname, '..', '..', 'storage');

// Ensure root subdirectories exist
const SUBDIRS = ['products', 'blogs', 'catalogs', 'logos', 'general'];
SUBDIRS.forEach(sub => {
  const dir = path.join(STORAGE_ROOT, sub);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Allowed MIME types and corresponding safe extensions
const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/svg+xml': '.svg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'general';
    const reqPath = (req.baseUrl || req.path || '').toLowerCase();
    if (reqPath.includes('product') || (req.body && req.body.category === 'products')) folder = 'products';
    else if (reqPath.includes('blog') || (req.body && req.body.category === 'blogs')) folder = 'blogs';
    else if (reqPath.includes('catalog') || (req.body && req.body.category === 'catalogs')) folder = 'catalogs';
    else if (reqPath.includes('setting') || (req.body && req.body.category === 'logos')) folder = 'logos';

    const targetDir = path.join(STORAGE_ROOT, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    const ext = MIME_TO_EXT[file.mimetype] || path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '') || '.png';
    const randomName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    cb(null, randomName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (MIME_TO_EXT[file.mimetype]) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and SVG images are allowed.'));
    }
  }
});

/**
 * Safely saves a base64 DataURL to disk in storage/<subfolder>/ and returns the relative path.
 * If data is already a URL or relative path (e.g. /storage/... or assets/...), returns it unchanged.
 */
function saveBase64Image(base64Data, subfolder = 'general', prefix = '') {
  if (!base64Data || typeof base64Data !== 'string') return base64Data;
  if (!base64Data.startsWith('data:image/')) return base64Data;

  const matches = base64Data.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return base64Data;
  }

  const mime = matches[1];
  const data = matches[2];
  const ext = MIME_TO_EXT[mime] || '.png';

  const safeSubfolder = subfolder.replace(/[^a-zA-Z0-9_-]/g, '') || 'general';
  const targetDir = path.join(STORAGE_ROOT, safeSubfolder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const safePrefix = prefix ? `${prefix.replace(/[^a-zA-Z0-9_-]/g, '')}-` : '';
  const filename = `${safePrefix}${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const filePath = path.join(targetDir, filename);

  const buffer = Buffer.from(data, 'base64');
  fs.writeFileSync(filePath, buffer);

  return `/storage/${safeSubfolder}/${filename}`;
}

upload.upload = upload;
upload.saveBase64Image = saveBase64Image;
upload.STORAGE_ROOT = STORAGE_ROOT;

module.exports = upload;
