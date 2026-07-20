const express = require('express');
const router = express.Router();
const {
  getCatalogs,
  getCatalogById,
  createCatalog,
  updateCatalog,
  deleteCatalog
} = require('../controllers/catalogController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getCatalogs);
router.get('/:id', getCatalogById);

router.post('/', protect, adminOnly, createCatalog);
router.put('/:id', protect, adminOnly, updateCatalog);
router.patch('/:id', protect, adminOnly, updateCatalog);
router.delete('/:id', protect, adminOnly, deleteCatalog);

module.exports = router;
