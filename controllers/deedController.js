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

// In case of buyer
// [HTTP POST]
exports.requestFunds = async (req, res) => {
  try {
    const { user_id, deed_id, milestone_id } = req.body;
    const deed = await Deed.findByPk(deed_id);

    if (!deed) {
      return res.status(404).json({ error: 'Deed not found' });
    }

    // Check if the caller is the buyer
    if (user_id !== deed.buyer_id) {
      return res.status(403).json({ error: 'Only the buyer can request funds.' });
    }

    if (milestone_id) {
      // Check if the milestone exists
      const milestone = await DeedMilestone.findByPk(milestone_id);
      if (!milestone || milestone.deed_id !== deed_id) {
        return res.status(404).json({ error: 'Milestone not found for this deed.' });
      }

      // Check if the milestone status allows requesting funds
      if (milestone.status !== 'pending') {
        return res.status(400).json({ error: 'Funds have already been requested or released for this milestone.' });
      }

      // Change milestone status to "requested"
      milestone.status = 'requested';
      await milestone.save();
      res.json({ message: 'Funds requested successfully for the milestone.', milestone });
    } else {
      // Release complete payment
      deed.status = 'completed'; // Change deed status to completed
      await deed.save();
      res.json({ message: 'Complete payment requested successfully.', deed });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// In case of Seller
// [HTTP POST]
exports.releaseFunds = async (req, res) => {
  try {
    const { user_id, deed_id, milestone_id } = req.body;
    const deed = await Deed.findByPk(deed_id);

    if (!deed) {
      return res.status(404).json({ error: 'Deed not found' });
    }

    // Check if the caller is the seller
    if (user_id !== deed.seller_id) {
      return res.status(403).json({ error: 'Only the seller can release funds.' });
    }

    if (milestone_id) {
      // Release funds for a specific milestone
      const milestone = await DeedMilestone.findByPk(milestone_id);
      if (!milestone || milestone.deed_id !== deed_id) {
        return res.status(404).json({ error: 'Milestone not found for this deed.' });
      }

      // Check if the funds have been requested for this milestone
      if (milestone.status !== 'requested') {
        return res.status(400).json({ error: 'Funds have not been requested for this milestone.' });
      }

      // Change milestone status to "released"
      milestone.status = 'released';
      await milestone.save();
      res.json({ message: 'Milestone funds released successfully.', milestone });
    } else {
      // Release complete payment
      deed.status = 'completed'; // Change deed status to completed
      await deed.save();
      res.json({ message: 'Complete payment released successfully.', deed });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// [HTTP GET]
exports.getMilestonesByDeedId = async (req, res) => {
  try {
    const { deed_id } = req.params;

    // Find the deed to ensure it exists
    const deed = await Deed.findByPk(deed_id);
    if (!deed) {
      return res.status(404).json({ error: 'Deed not found' });
    }

    // Retrieve milestones associated with the deed
    const milestones = await DeedMilestone.findAll({
      where: { deed_id },
    });

    // If there are no milestones, return a message
    if (milestones.length === 0) {
      return res.status(404).json({ message: 'No milestones found for this deed.' });
    }

    res.json(milestones);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//[HTTP PATCH]
exports.updateMilestoneByMilestoneId = async (req, res) => {
  try {
    const { milestone_id } = req.params;
    const { milestone_name, amount, timeline, status } = req.body;

    // Find the milestone to ensure it exists
    const milestone = await DeedMilestone.findByPk(milestone_id);
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    // Update milestone details
    if (milestone_name) milestone.milestone_name = milestone_name;
    if (amount) milestone.amount = amount;
    if (timeline) milestone.timeline = timeline;
    if (status) milestone.status = status; 

    await milestone.save(); 

    res.json({ message: 'Milestone updated successfully.', milestone });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
