const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Faq', {
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active', // Default status is active
    },
  });
};