const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

const allowSelfOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role !== 'Customer' || req.user.id === req.params.id)) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied.' });
};

router.get('/', protect, adminOnly, getUsers);
router.patch('/:id', protect, allowSelfOrAdmin, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
