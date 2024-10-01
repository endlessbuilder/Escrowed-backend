const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Disputes', {
    deed_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Deeds',
        key: 'id',
      },
    },
    raised_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    resolution: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('open', 'resolved', 'closed'),
      defaultValue: 'open',
    },
    resolved_at: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    closed_at: {
      type: DataTypes.TIME,
      allowNull: true,
    }
  });
};
