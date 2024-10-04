const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Suggestion', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    suggestion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'reviewed'),
      defaultValue: 'pending',
    },
  });
};