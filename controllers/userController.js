const { User } = require('../models');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users
    });
  } catch (err) {
    logger.error('Get users error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: err.message
    });
  }
};

/**
 * @desc    Get single user by ID (Admin only)
 * @route   GET /api/v1/users/:id
 * @access  Private/Admin
 */
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (err) {
    logger.error('Get user error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
      error: err.message
    });
  }
};

/**
 * @desc    Update user (Admin only)
 * @route   PUT /api/v1/users/:id
 * @access  Private/Admin
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, isActive } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check for unique username
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    // Check for unique email
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
    }

    // Update user
    await user.update({
      username: username || user.username,
      email: email || user.email,
      role: role || user.role,
      isActive: isActive !== undefined ? isActive : user.isActive
    });

    logger.info(`[USER] User updated: ${user.username} (ID: ${user.id}) by admin ${req.user.id}`);

    // Return user without password
    const userResponse = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: userResponse
    });
  } catch (err) {
    logger.error('Update user error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: err.message
    });
  }
};

/**
 * @desc    Delete user (Admin only)
 * @route   DELETE /api/v1/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const username = user.username;
    await user.destroy();

    logger.info(`[USER] User deleted: ${username} (ID: ${id}) by admin ${req.user.id}`);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (err) {
    logger.error('Delete user error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: err.message
    });
  }
};