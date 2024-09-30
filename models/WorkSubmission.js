const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('WorkSubmission', {
    deed_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Deeds',
        key: 'id',
      },
    },
    submitted_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    file_link: {
      type: DataTypes.STRING,
      allowNull: true, // For uploaded files
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'revision_requested', 'fraud_reported'),
      defaultValue: 'pending',
    },
  });
};
