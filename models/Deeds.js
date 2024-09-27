const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Deeds', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM('Ethereum', 'Solana', 'Ton'),
      allowNull: false,
    },
    payment_type: {
      type: DataTypes.ENUM('one_time', 'milestone'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: true, // Nullable for milestones
    },
    timeline: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable for milestones
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled', 'disputed'),
      defaultValue: 'pending',
    },
    buyer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    category: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('Buyer', 'Seller'),
      defaultValue: 'Seller',
    }
  });
};
