const { Log } = require('../models');

// create a new log
exports.createLog = async (req, res) => {
  try {
    const { sender_id, recipient_id, message, message_type, deed_id, dispute_id } = req.body;
    const newMessage = await Log.create({
      sender_id,
      recipient_id,
      message,
      message_type,
      deed_id,
      dispute_id,
    });
    return res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all logs for a specific user
exports.getLogsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const messages = await Log.findAll({
      where: {
        [Op.or]: [{ sender_id: userId }, { recipient_id: userId }],
      },
    });
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};