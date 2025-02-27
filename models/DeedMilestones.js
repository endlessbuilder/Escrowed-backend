const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('DeedMilestones', {
    deed_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Deeds',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    timeline: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'requested', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
  });
};
