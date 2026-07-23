const mongoose = require('mongoose');
const CustomerProduct = require('../models/CustomerProduct');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get products assigned to a specific customer
// @route   GET /api/customer/:id/products
// @access  Private
exports.getCustomerProducts = async (req, res) => {
  try {
    const customerId = req.params.id;
    const isAdmin = req.user && (req.user.role === 'Admin' || req.user.role === 'Super Admin' || req.user.role === 'Sales Executive');

    // Build query filter
    const query = { customerId: customerId };
    if (!isAdmin) {
      query.visible = true; // Customers only see visible assigned products
    }

    let assignments = await CustomerProduct.find({
      $or: [{ customerId: customerId }, { customerId: String(customerId) }]
    }).sort({ featured: -1, createdAt: -1 }).lean();

    if (!isAdmin) {
      assignments = assignments.filter(a => a.visible !== false);
    }

    const allProducts = await Product.find().lean();

    // Format output payload combining product info with customer-specific overrides
    const formattedProducts = assignments.map(a => {
      let p = allProducts.find(prod => String(prod._id) === String(a.productId) || String(prod.id) === String(a.productId));
      if (!p) {
        // Fallback placeholder product object if not in DB
        p = {
          _id: a.productId,
          name: 'Custom Assigned Uniform',
          category: 'Corporate Workwear',
          desc: 'Special contract uniform assigned to account.',
          price: null,
          moq: 100
        };
      }
      return {
        ...p,
        assignmentId: a._id,
        customerId: a.customerId,
        assignedDate: a.assignedDate,
        customPrice: a.customPrice !== undefined && a.customPrice !== null ? a.customPrice : (p.price || null),
        customMOQ: a.customMOQ !== undefined && a.customMOQ !== null ? a.customMOQ : (p.moq || 100),
        effectivePrice: a.customPrice !== undefined && a.customPrice !== null ? a.customPrice : (p.price || null),
        effectiveMOQ: a.customMOQ !== undefined && a.customMOQ !== null ? a.customMOQ : (p.moq || 100),
        visible: a.visible !== false,
        featuredInCatalog: Boolean(a.featured),
        customerNotes: a.notes || ''
      };
    }).filter(Boolean);

    res.json({
      success: true,
      count: formattedProducts.length,
      data: formattedProducts,
      rawAssignments: assignments
    });
  } catch (err) {
    console.error('[getCustomerProducts error]', err);
    res.status(500).json({ success: false, message: err.message || 'Server error fetching assigned products.' });
  }
};

// @desc    Assign product(s) to a customer (supports single or bulk assignment)
// @route   POST /api/customer-products
// @access  Private (Admin / Sales)
exports.assignCustomerProducts = async (req, res) => {
  try {
    const { customerId, productIds, productId, customPrice, customMOQ, visible, featured, notes } = req.body;

    if (!customerId) {
      return res.status(400).json({ success: false, message: 'Customer ID is required.' });
    }

    let targetCustomer = null;
    if (mongoose.Types.ObjectId.isValid(customerId)) {
      targetCustomer = await User.findById(customerId).catch(() => null);
    }
    if (!targetCustomer) {
      targetCustomer = await User.findOne({ $or: [{ email: customerId }, { id: customerId }] }).catch(() => null);
    }

    // Determine list of product IDs to assign
    const listToAssign = Array.isArray(productIds) && productIds.length > 0
      ? productIds
      : (productId ? [productId] : []);

    if (listToAssign.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one product ID must be provided for assignment.' });
    }

    const createdAssignments = [];
    for (const pId of listToAssign) {
      const assignmentObj = {
        customerId: customerId,
        productId: pId,
        assignedBy: req.user ? req.user._id : null,
        visible: visible !== undefined ? Boolean(visible) : true,
        customPrice: customPrice !== undefined && customPrice !== '' && customPrice !== null ? Number(customPrice) : null,
        customMOQ: customMOQ !== undefined && customMOQ !== '' && customMOQ !== null ? Number(customMOQ) : null,
        featured: featured !== undefined ? Boolean(featured) : false,
        notes: notes || ''
      };

      const record = await CustomerProduct.findOneAndUpdate(
        { customerId: customerId, productId: pId },
        assignmentObj,
        { upsert: true, new: true }
      );
      createdAssignments.push(record);
    }



    res.status(201).json({
      success: true,
      message: `Successfully assigned ${listToAssign.length} product(s) to customer.`,
      data: createdAssignments
    });
  } catch (err) {
    console.error('[assignCustomerProducts error]', err);
    res.status(500).json({ success: false, message: err.message || 'Server error assigning products to customer.' });
  }
};

// @desc    Update customer-product assignment settings
// @route   PUT /api/customer-products/:id
// @access  Private (Admin / Sales)
exports.updateCustomerProductAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const { customPrice, customMOQ, visible, featured, notes } = req.body;

    const assignment = await CustomerProduct.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment record not found.' });
    }

    if (customPrice !== undefined) assignment.customPrice = customPrice !== '' && customPrice !== null ? Number(customPrice) : null;
    if (customMOQ !== undefined) assignment.customMOQ = customMOQ !== '' && customMOQ !== null ? Number(customMOQ) : null;
    if (visible !== undefined) assignment.visible = Boolean(visible);
    if (featured !== undefined) assignment.featured = Boolean(featured);
    if (notes !== undefined) assignment.notes = notes;

    await assignment.save();



    res.json({
      success: true,
      message: 'Assignment parameters updated successfully.',
      data: assignment
    });
  } catch (err) {
    console.error('[updateCustomerProductAssignment error]', err);
    res.status(500).json({ success: false, message: err.message || 'Server error updating product assignment.' });
  }
};

// @desc    Remove product assignment from customer
// @route   DELETE /api/customer-products/:id
// @access  Private (Admin / Sales)
exports.removeCustomerProductAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const assignment = await CustomerProduct.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment record not found.' });
    }

    await CustomerProduct.findByIdAndDelete(assignmentId);



    res.json({
      success: true,
      message: 'Product assignment removed from customer.'
    });
  } catch (err) {
    console.error('[removeCustomerProductAssignment error]', err);
    res.status(500).json({ success: false, message: err.message || 'Server error removing product assignment.' });
  }
};
