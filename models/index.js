const Sequelize = require("sequelize");
const dbConfig = require("../config/config");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  dialectOptions: {
    connectTimeout: 30000 
  },
  port: dbConfig.PORT,
  charset  : 'utf8mb4',
});


const User = require('./Users')(sequelize);
const Deed = require('./Deeds')(sequelize);
const Dispute = require('./Disputes')(sequelize);
const DeedMilestone = require('./DeedMilestones')(sequelize);
const Log = require('./Logs')(sequelize);
const WorkSubmission = require('./WorkSubmission')(sequelize);

// Define relationships
User.hasMany(Deed, { foreignKey: 'buyer_id' }); 
User.hasMany(Deed, { foreignKey: 'seller_id' }); 
Deed.belongsTo(User, { foreignKey: 'buyer_id', as: 'Buyer' }); 
Deed.belongsTo(User, { foreignKey: 'seller_id', as: 'Seller' }); 

Deed.hasMany(DeedMilestone, { foreignKey: 'deed_id' }); 
DeedMilestone.belongsTo(Deed, { foreignKey: 'deed_id' }); 

Dispute.belongsTo(Deed, { foreignKey: 'deed_id' }); 
Dispute.belongsTo(User, { foreignKey: 'raised_by', as: 'Raiser' }); 

Log.belongsTo(User, { foreignKey: 'sender_id', as: 'Sender' }); 
Log.belongsTo(User, { foreignKey: 'recipient_id', as: 'Recipient' }); 
Log.belongsTo(Deed, { foreignKey: 'deed_id' }); 
Log.belongsTo(Dispute, { foreignKey: 'dispute_id' }); 


module.exports = { sequelize, User, Deed, DeedMilestone, Dispute, WorkSubmission, Log };