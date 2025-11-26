const { Product, User } = require('../models');
const logger = require('../utils/logger');

/**
 * @desc    Get all products with pagination and filtering
 * @route   GET /api/v1/products
 * @access  Private
 */
exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (category) {
      whereClause.category = category;
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    logger.error('Get products error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: err.message
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/v1/products/:id
 * @access  Private
 */
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (err) {
    logger.error('Get product error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: err.message
    });
  }
};

/**
 * @desc    Get products created by current user
 * @route   GET /api/v1/products/my-products
 * @access  Private
 */
exports.getMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    const products = await Product.findAll({
      where: { createdBy: userId },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      message: 'Your products retrieved successfully',
      data: products
    });
  } catch (err) {
    logger.error('Get my products error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve your products',
      error: err.message
    });
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/v1/products
 * @access  Private
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const userId = req.user.id;

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock: stock || 0,
      category,
      createdBy: userId
    });

    logger.info(`[PRODUCT] New product created: ${newProduct.name} (ID: ${newProduct.id}) by user ${userId}`);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (err) {
    logger.error('Create product error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: err.message
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/v1/products/:id
 * @access  Private (Owner or Admin)
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user is owner or admin
    if (product.createdBy !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    // Update product
    await product.update({
      name: name || product.name,
      description: description !== undefined ? description : product.description,
      price: price || product.price,
      stock: stock !== undefined ? stock : product.stock,
      category: category !== undefined ? category : product.category
    });

    logger.info(`[PRODUCT] Product updated: ${product.name} (ID: ${product.id}) by user ${userId}`);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (err) {
    logger.error('Update product error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: err.message
    });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/v1/products/:id
 * @access  Private (Admin only)
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const productName = product.name;
    await product.destroy();

    logger.info(`[PRODUCT] Product deleted: ${productName} (ID: ${id}) by admin ${req.user.id}`);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    logger.error('Delete product error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: err.message
    });
  }
};