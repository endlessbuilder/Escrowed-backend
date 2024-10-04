const { Log } = require('../models');

// Create a message for the recipient. (This is used for Share Copy link feature)
// [HTTP POST]
exports.createLog = async (req, res) => {
  try {
    const { sender_id, sender_name, recipient_id, message, message_type, deed_id, dispute_id } = req.body;
    const newMessage = await Log.create({
      sender_id,
      sender_name,
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
// It is used for Notification feature
// [HTTP GET]
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

// Make this notification read so that we can see the user has already read it.
// [HTTP PATCH]
exports.readUpdateLog = async (req, res) => {
  try {
    const { log_id } = req.params;

    // Find the log entry by ID
    const log = await Log.findByPk(log_id);
    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }

    log.isRead = true; // Update isRead true

    await log.save(); 

    res.json({ message: 'Log updated successfully', log });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};