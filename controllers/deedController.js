const { Deed, DeedMilestone } = require('../models');

// Create a deed
// [HTTP POST]
exports.createDeed = async (req, res) => {
  try {
    const { userId, title, description, payment_method, payment_type, amount, timeline, milestones } = req.body;
    const deed = await Deed.create({
      title,
      description,
      payment_method,
      payment_type,
      amount: amount,
      timeline: timeline,
      seller_id: userId,
    });

    if (payment_type === 'milestone') {
      for (const milestone of milestones) {
        await DeedMilestone.create({ ...milestone, deed_id: deed.id });
      }
    }

    res.status(201).json(deed);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all deeds
// [HTTP GET]
exports.getAllDeeds = async (req, res) => {
  try {
    const deeds = await Deed.findAll();
    return res.status(200).json(deeds);
  } catch (error) {
    console.error('Error fetching deeds:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a deed by ID
// [HTTP GET]
exports.getDeedById = async (req, res) => {
  try {
    const deedId = req.params.id;
    const deed = await Deed.findOne({ where: { id: deedId } });
    if (!deed) {
      return res.status(404).json({ message: 'Deed not found' });
    }
    return res.status(200).json(deed);
  } catch (error) {
    console.error('Error fetching deed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a deed
// [HTTP PATCH]
exports.updateDeed = async (req, res) => {
  try {
    const deedId = req.params.id;
    const deed = await Deed.findOne({ where: { id: deedId } });
    if (!deed) {
      return res.status(404).json({ message: 'Deed not found' });
    }
    await deed.update(req.body);
    return res.status(200).json({ message: 'Deed updated successfully', deed });
  } catch (error) {
    console.error('Error updating deed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
