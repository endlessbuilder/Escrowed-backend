const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Deed } = require('../models');

// [HTTP POST]
exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
     // Check if the email already exists
     const existingUser = await User.findOne({ where: { email } });
     if (existingUser) {
       return res.status(400).json({ error: 'Email already exists.' });
     }
     
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ first_name, last_name, email, password: hashedPassword });
    res.status(201).json({ id: user.id, email: user.email});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// [HTTP POST]
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!user || !(await bcrypt.compare(hashedPassword, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (user.isActive == false) {
      return res.status(401).json({ error: 'User is deactivated' });
    }
    // const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [HTTP GET]
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'first_name', 'last_name', 'email'], 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// [HTTP PATCH]
exports.updateUserDetail = async (req, res) => {
  try {
    const userId = req.params.id;
    const { first_name, last_name, password } = req.body;

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      first_name,
      last_name,
      password,
    });

    return res.status(200).json({ message: 'User details updated successfully', user });
  } catch (error) {
    console.error('Error updating user details:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// [HTTP GET]
exports.getUserActivity = async (req, res) => {
  try {
    const userId = req.params.userId; 

    const activity = await Deed.findAll({
      where: { seller_id: userId }, 
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalDeeds'], // Total deeds
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalMoney'], // Total money
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 'pending' OR status = 'in_progress' THEN 1 ELSE 0 END")), 'activeDeeds'], // Active deeds
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 'completed' THEN 1 ELSE 0 END")), 'completedDeeds'], // Completed deeds
      ],
    });

    // Extract the activity data
    const activityData = activity[0] || {
      totalDeeds: 0,
      totalMoney: 0,
      activeDeeds: 0,
      completedDeeds: 0,
    };

    res.json(activityData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// [HTTP GET]
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};