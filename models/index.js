const User = require('./User');
const Product = require('./Product');

// Define associations
User.hasMany(Product, {
  foreignKey: 'createdBy',
  as: 'products',
  onDelete: 'CASCADE'
});

Product.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

module.exports = {
  User,
  Product
};