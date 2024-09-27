const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Logs', {
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    recipient_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    message_type: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deed_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Deeds',
        key: 'id',
      },
    },
    dispute_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Disputes',
        key: 'id',
      },
    },
  });
};
